const split = require('split')
const matchRegex = /^(.+) ([0-9]+), (.+) ([0-9]+)$/

const parseMatch = (matchText) => {
  const matchResult = matchText.match(matchRegex)
  if (!matchResult || matchResult.length !== 5) {
    throw new Error(`Invalid match text: ${matchText}`)
  }
  matchResult.shift()
  return [
    {
      teamName: matchResult[0],
      score: parseInt(matchResult[1]),
    },
    {
      teamName: matchResult[2],
      score: parseInt(matchResult[3]),
    },
  ]
}

const reduceMatches = (matches) =>
  matches.reduce((pointsMap, match) => {
    const addPoints = (teamName, points) => {
      const total = pointsMap.get(teamName)
      pointsMap.set(teamName, total ? total + points : points)
    }
    if (match[0].score === match[1].score) {
      addPoints(match[0].teamName, 1)
      addPoints(match[1].teamName, 1)
    } else {
      const [winner, loser] = match.slice(0).sort((a, b) => b.score - a.score)
      addPoints(winner.teamName, 3)
      addPoints(loser.teamName, 0)
    }
    return pointsMap
  }, new Map())

const sortPointsMap = (pointsMap) =>
  Array.from(pointsMap.entries())
    .slice(0)
    .sort((a, b) => b[1] - a[1])
    .map((entry) => ({ teamName: entry[0], points: entry[1] }))

const decorateRank = (sortedTeams) => {
  let rank = 1
  return sortedTeams.map((team, index, array) => {
    if (index === 0 || team.points < array[index - 1].points) {
      rank = index + 1
    }
    return { rank, ...team }
  })
}

const formatPointsUnitsLabel = (points) => (points === 1 ? 'pt' : 'pts')

const formatTeamEntry = ({ teamName, points, rank }) =>
  `${rank}. ${teamName}, ${points} ${formatPointsUnitsLabel(points)}`

const main = async (stream = process.stdin, lines = []) =>
  stream
    .pipe(split())
    .on('data', (line) => lines.push(line))
    .on('end', () => {
      process.stdout.write(
        decorateRank(
          sortPointsMap(
            reduceMatches(lines.filter((line) => line).map(parseMatch)),
          ),
        )
          .map((entry) => formatTeamEntry(entry))
          .join('\n') + '\n',
      )
    })

module.exports = {
  parseMatch,
  reduceMatches,
  sortPointsMap,
  decorateRank,
  formatPointsUnitsLabel,
  formatTeamEntry,
  main,
}
