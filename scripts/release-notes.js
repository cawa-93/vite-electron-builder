/*
 *
 * TODO:
 * - [ ] Refactor this script
 * - [ ] Add comments
 * - [ ] Merge commits with same commit subject
 *
 */

const {execSync} = require('child_process')


/**
 * @typedef {Object} ICommit
 * @property {string} abbreviated_commit
 * @property {string} subject
 * @property {string} body
 */

/**
 * @typedef {ICommit & {type: string, scope: string, clearSubject: string}} ICommitExtended
 */

/**
 * @typedef {Map<string, {scopes: Map<string, {commits: ICommitExtended[]}>, commits: ICommitExtended[]}>} IGroupedCommits
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
  ['abbreviated_commit', '%h'],
  ['subject', '%s'],
  // ['body', '%b'], // Uncomment if you wand include commit body to release notes
])

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
 *
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
function getCommitData(commit) {
  let [, , type, , scope, text] = commit.subject.match(/^((feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|deps)(\((\w+)\))?:)?(.*)/i)

  if (type === undefined && commit.subject.startsWith('revert')) {
    type = 'revert'
  }

  return {
    type: (type || '').toLowerCase().trim(),
    scope: (scope || '').toLowerCase().trim(),
    clearSubject: (text || '').trim(),
    ...commit,
  }
}

function getEmptyType() {
  return {
    // type: typeName,
    scopes: new Map(),
    commits: [],
  }
}

function getEmptyScope() {
  return {
    commits: [],
  }
}


/**
 *
 * @param {ICommit[]} commits
 * @returns {IGroupedCommits}
 */
function getGroupedCommits(commits) {
  const parsedCommits = commits.map(getCommitData)

  const types = new Map

  for (const parsedCommit of parsedCommits) {
    const typeId = parsedCommit.type
    const type = types.get(typeId) || getEmptyType()

    if (parsedCommit.scope !== '') {
      const scopeId = parsedCommit.scope
      const scope = type.scopes.get(scopeId) || getEmptyScope()
      scope.commits.push(parsedCommit)
      type.scopes.set(scopeId, scope)
    } else {
      type.commits.push(parsedCommit)
    }

    types.set(typeId, type)
  }

  return types
}

/**
 *
 * @param {ICommitExtended[]} commits
 * @param {string} pad
 */
function getCommitsList(commits, pad = '') {
  let changelog = ''
  for (const commit of commits) {
    changelog += `${pad}- ${commit.clearSubject || commit.subject}. (${commit.abbreviated_commit})\n`

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
    case 'undefined':
      return 'Other Changes'
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
    default:
      return str
  }
}

function getScopeChangeLog(scope) {
  let changelog = ''
  if (scope.commits.length) {
    changelog += getCommitsList(scope.commits, '  ')
  }

  return changelog
}


function getGroupChangeLog(group) {
  let changelog = ''

  for (const [scopeId, scope] of group.scopes) {
    if (scopeId !== '') {
      changelog += `- #### ${replaceHeader(scopeId || 'undefined')}\n`
      changelog += getScopeChangeLog(scope)
    }
  }

  if (group.scopes.has('')) {
    changelog += `- #### ${replaceHeader('undefined')}\n`
    changelog += getScopeChangeLog(group.scopes.get(''))
  }

  if (group.commits.length) {
    changelog += getCommitsList(group.commits)
  }

  changelog += '\n\n'

  return changelog
}


/**
 *
 * @param {IGroupedCommits} groups
 */
function getChangeLog(groups) {

  let changelog = ''

  for (const [typeId, group] of groups) {
    if (typeId !== '') {
      changelog += `### ${replaceHeader(typeId)}\n`
      changelog += getGroupChangeLog(group)
    }
  }

  if (groups.has('')) {
    changelog += `### ${replaceHeader('undefined')}\n`
    changelog += getGroupChangeLog(groups.get(''))
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
