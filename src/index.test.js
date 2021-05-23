const {
  parseMatch,
  reduceMatches,
  sortPointsMap,
  decorateRank,
  formatTeamEntry,
  formatPointsUnitsLabel,
} = require('.')

describe('Match utils', () => {
  const sampleMatches = [
    'Lions 3, Snakes 3',
    'Tarantulas 1, FC Awesome 0',
    'Lions 1, FC Awesome 1',
    'Tarantulas 3, Snakes 1',
    'Lions 4, Grouches 0',
  ]

  const rankedTeams = {
    ['Tarantulas']: 6,
    ['Lions']: 5,
    ['FC Awesome']: 1,
    ['Snakes']: 1,
    ['Grouches']: 0,
  }

  it('should format singular point', () => {
    expect(formatPointsUnitsLabel(1)).toEqual('pt')
  })

  it('should format plural points', () => {
    expect(formatPointsUnitsLabel(2)).toEqual('pts')
    expect(formatPointsUnitsLabel(3)).toEqual('pts')
  })

  it('should parse matches', () => {
    expect(parseMatch('Tarantulas 1, FC Awesome 0')).toEqual([
      {
        teamName: 'Tarantulas',
        score: 1,
      },
      {
        teamName: 'FC Awesome',
        score: 0,
      },
    ])
  })

  it('should reduce matches', () => {
    expect(
      Array.from(
        reduceMatches([
          [
            {
              teamName: 'Tarantulas',
              score: 3,
            },
            {
              teamName: 'FC Awesome',
              score: 0,
            },
          ],
        ]).entries(),
      ),
    ).toStrictEqual([
      ['Tarantulas', 3],
      ['FC Awesome', 0],
    ])
  })

  it('should reduce sample matches', () => {
    const teams = reduceMatches(
      sampleMatches.map((matchText) => parseMatch(matchText)),
    )
    expect(Array.from(teams.keys())).toStrictEqual([
      'Lions',
      'Snakes',
      'Tarantulas',
      'FC Awesome',
      'Grouches',
    ])
    expect(teams.get('Lions')).toStrictEqual(5)
    expect(teams.get('Snakes')).toStrictEqual(1)
    expect(teams.get('Tarantulas')).toStrictEqual(6)
    expect(teams.get('FC Awesome')).toStrictEqual(1)
  })

  it('should format ranked teams', () => {
    const teams = reduceMatches(
      sampleMatches.map((matchText) => parseMatch(matchText)),
    )
    const formatted = decorateRank(sortPointsMap(teams)).map((entry) =>
      formatTeamEntry(entry),
    )
    expect(formatted).toStrictEqual([
      '1. Tarantulas, 6 pts',
      '2. Lions, 5 pts',
      '3. Snakes, 1 pt',
      '3. FC Awesome, 1 pt',
      '5. Grouches, 0 pts',
    ])
  })
})
