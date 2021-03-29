/*
 *
 * TODO:
 * - [ ] Refactor this script
 * - [ ] Add comments
 * - [ ] Merge commits with same commit subject
 *
 */

const fs = require('fs')
const {spawn, execSync} = require('child_process')

const format = '{^^^^commit^^^^: ^^^^%H^^^^,^^^^abbreviated_commit^^^^: ^^^^%h^^^^,^^^^subject^^^^: ^^^^%s^^^^,^^^^body^^^^: ^^^^%b^^^^}'

/**
 * @typedef {Object} ICommit
 * @property {string} commit
 * @property {string} abbreviated_commit
 * @property {string} subject
 * @property {string} body
 */

/**
 *
 * @return {Promise<ICommit[]>}
 */
async function getCommits() {
  return new Promise((resolve, reject) => {

    const startFrom = String(execSync('git describe --tags --abbrev=0 || git rev-list --max-parents=0 HEAD')).trim()


    const git = spawn('git', ['--no-pager', 'log', `${startFrom}..HEAD`, '--pretty=format:' + format])
    let commits = ''
    let errors = ''

    git.stdout.on('data', (data) => {
      commits += data
    })

    git.stderr.on('data', (data) => {
      errors += data
    })

    git.on('exit', (code) => {
      if (code !== 0) {
        reject(errors)
        return
      }

      const commitsArray = commits.split(/}\n{/)

      const jsonReady = `[${commitsArray
        .map(rawCommitText => {
          return rawCommitText
            .replace(/"/g, '\\\"')
            .replace(/\^\^\^\^/g, '"')
            .replace(/(\r)?\n/gm, '\\n')

        }).join('}\n,{')
      }]`

      resolve(JSON.parse(jsonReady))
    })
  })
}

/**
 * @typedef {ICommit & {type: string, scope: string, clearSubject: string}} ICommitExtended
 */

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
 * @typedef {Map<string, {scopes: Map<string, {commits: ICommitExtended[]}>, commits: ICommitExtended[]}>} IGroupedCommits
 */

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
    const body = commit.body.replace('[skip ci]', '').trim()
    if (body !== '') {
      changelog += `\n${body.split('\n').map(s => `${pad}  ${s}`).join('\n')}\n`
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

  return changelog
}


getCommits()
  .then(getGroupedCommits)
  .then(getChangeLog)
  // .then(s => fs.promises.writeFile('../CHANGELOG.md', s, {encoding: 'utf-8'})) // For debug
  .then(console.log)
  .catch(console.error)
