const {execSync} = require('child_process')


/**
 * @typedef {Object} ICommit
 * @property {string | undefined} abbreviated_commit
 * @property {string | undefined} subject
 * @property {string | undefined} body
 */

/**
 * @typedef {ICommit & {type: string | undefined, scope: string | undefined}} ICommitExtended
 */


/**
 * Any unique string that is guaranteed not to be used in committee text.
 * Used to split data in the commit line
 * @type {string}
 */
const commitInnerSeparator = '~~~~'


/**
 * Any unique string that is guaranteed not to be used in committee text.
 * Used to split each commit line
 * @type {string}
 */
const commitOuterSeparator = '₴₴₴₴'


/**
 * Commit data to be obtained.
 * @type {Map<string, string>}
 *
 * @see https://git-scm.com/docs/git-log#Documentation/git-log.txt-emnem
 */
const commitDataMap = new Map([
  ['subject', '%s'], // Required
  ['abbreviated_commit', '%h'],
  // ['body', '%b'], // Uncomment if you wand include commit body to release notes
])


/**
 * The type used to group commits that do not comply with the convention
 * @type {string}
 */
const fallbackType = 'other'


/**
 * List of all desired commit groups and in what order to display them.
 * @type {string[]}
 */
const supportedTypes = [
  'feat',
  'fix',
  'perf',
  'refactor',
  'style',
  'docs',
  'test',
  'build',
  'ci',
  'chore',
  'revert',
  'deps',
  fallbackType,
]

/**
 * @param {string} commitString
 * @returns {ICommit}
 */
function parseCommit(commitString) {
  /** @type {ICommit} */
  const commitDataObj = {}
  const commitDataArray =
    commitString
      .split(commitInnerSeparator)
      .map(s => s.trim())

  for (const [key] of commitDataMap) {
    commitDataObj[key] = commitDataArray.shift()
  }

  return commitDataObj
}

/**
 * Returns an array of commits since the last git tag
 * @return {ICommit[]}
 */
function getCommits() {

  /**
   * Where to start load history.
   * Could be last git tag or initial commit.
   * @type {string}
   */
  const startFrom = String(execSync('git describe --tags --abbrev=0 || git rev-list --max-parents=0 HEAD')).trim()

  const format = Array.from(commitDataMap.values()).join(commitInnerSeparator) + commitOuterSeparator

  const logs = String(execSync(`git --no-pager log ${startFrom}..HEAD --pretty=format:"${format}"`))

  return logs
    .trim()
    .split(commitOuterSeparator)
    .filter(r => !!r.trim()) // Skip empty lines
    .map(parseCommit)
}


/**
 *
 * @param {ICommit} commit
 * @return {ICommitExtended}
 */
function setCommitTypeAndScope(commit) {

  const matchRE = new RegExp(`^(?:(${supportedTypes.join('|')})(?:\\((\\S+)\\))?:)?(.*)`, 'i')

  let [, type, scope, clearSubject] = commit.subject.match(matchRE)

  /**
   * Additional rules for checking committees that do not comply with the convention, but for which it is possible to determine the type.
   */
  // Commits like `revert something`
  if (type === undefined && commit.subject.startsWith('revert')) {
    type = 'revert'
  }

  return {
    ...commit,
    type: (type || fallbackType).toLowerCase().trim(),
    scope: (scope || '').toLowerCase().trim(),
    subject: (clearSubject || commit.subject).trim(),
  }
}

class CommitGroup {
  constructor() {
    this.scopes = new Map
    this.commits = []
  }

  /**
   *
   * @param {ICommitExtended[]} array
   * @param {ICommitExtended} commit
   */
  static #pushOrMerge(array, commit) {
    const similarCommit = array.find(c => c.subject === commit.subject)
    if (similarCommit) {
      if (commit.abbreviated_commit !== undefined) {
        similarCommit.abbreviated_commit += `, ${commit.abbreviated_commit}`
      }
    } else {
      array.push(commit)
    }
  }

  /**
   * @param {ICommitExtended} commit
   */
  push(commit) {
    if (!commit.scope) {
      CommitGroup.#pushOrMerge(this.commits, commit)
      return
    }

    const scope = this.scopes.get(commit.scope) || {commits: []}
    CommitGroup.#pushOrMerge(scope.commits, commit)
    this.scopes.set(commit.scope, scope)
  }

  get isEmpty() {
    return this.commits.length === 0 && this.scopes.size === 0
  }
}


/**
 * Groups all commits by type and scopes
 * @param {ICommit[]} commits
 * @returns {Map<string, CommitGroup>}
 */
function getGroupedCommits(commits) {
  const parsedCommits = commits.map(setCommitTypeAndScope)

  const types = new Map(
    supportedTypes.map(id => ([id, new CommitGroup()])),
  )

  for (const parsedCommit of parsedCommits) {
    const typeId = parsedCommit.type
    const type = types.get(typeId)
    type.push(parsedCommit)
  }

  return types
}

/**
 * Return markdown list with commits
 * @param {ICommitExtended[]} commits
 * @param {string} pad
 * @returns {string}
 */
function getCommitsList(commits, pad = '') {
  let changelog = ''
  for (const commit of commits) {
    changelog += `${pad}- ${commit.subject}.`

    if (commit.abbreviated_commit !== undefined) {
      changelog += ` (${commit.abbreviated_commit})`
    }

    changelog += '\n'

    if (commit.body === undefined) {
      continue
    }

    const body = commit.body.replace('[skip ci]', '').trim()
    if (body !== '') {
      changelog += `${
        body
          .split(/\n+/)
          .map(s => `${pad}  ${s}`)
          .filter(s => !!s.trim())
          .join('\n')
      }\n`
    }
  }

  return changelog
}


function replaceHeader(str) {
  switch (str) {
    case 'feat':
      return 'New Features'
    case 'fix':
      return 'Bug Fixes'
    case 'docs':
      return 'Documentation Changes'
    case 'build':
      return 'Build System'
    case 'chore':
      return 'Chores'
    case 'ci':
      return 'Continuous Integration'
    case 'refactor':
      return 'Refactors'
    case 'style':
      return 'Code Style Changes'
    case 'test':
      return 'Tests'
    case 'perf':
      return 'Performance improvements'
    case 'revert':
      return 'Reverts'
    case 'deps':
      return 'Dependency updates'
    case 'other':
      return 'Other Changes'
    default:
      return str
  }
}


/**
 * Return markdown string with changelog
 * @param {Map<string, CommitGroup>} groups
 */
function getChangeLog(groups) {

  let changelog = ''

  for (const [typeId, group] of groups) {
    if (group.isEmpty) {
      continue
    }

    changelog += `### ${replaceHeader(typeId)}\n`

    for (const [scopeId, scope] of group.scopes) {
      if (scope.commits.length) {
        changelog += `- #### ${replaceHeader(scopeId)}\n`
        changelog += getCommitsList(scope.commits, '  ')
      }
    }

    if (group.commits.length) {
      changelog += getCommitsList(group.commits)
    }

    changelog += '\n\n'
  }

  return changelog.trim()
}


try {
  const commits = getCommits()
  const grouped = getGroupedCommits(commits)
  const changelog = getChangeLog(grouped)
  console.log(changelog)
// require('fs').writeFileSync('../CHANGELOG.md', changelog, {encoding: 'utf-8'})
} catch (e) {
  console.error(e)
  process.exit(1)
}
