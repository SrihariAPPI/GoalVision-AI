import type { Match } from "../types.js";

// Realistic, hand-authored datasets for famous matches. Figures are faithful to the
// real fixtures but lightly rounded for a clean demo. No ML, no ingestion — just data.

export const matches: Match[] = [
  {
    id: "wc-2022-final",
    competition: "FIFA World Cup",
    stage: "Final",
    date: "2022-12-18",
    venue: "Lusail Stadium",
    city: "Lusail, Qatar",
    status: "PEN",
    result: "Argentina win 4-2 on penalties (3-3 AET)",
    headline: "Messi crowns his career as Argentina edge an all-time classic",
    score: { home: 3, away: 3, halfTime: [2, 0] },
    homeTeam: {
      id: "arg",
      name: "Argentina",
      shortName: "ARG",
      color: "#6CACE4",
      accent: "#0B3D91",
      formation: "4-3-3",
      manager: "Lionel Scaloni",
      lineup: [
        { id: "arg-1", name: "Emiliano Martínez", number: 23, position: "GK", x: 5, y: 50, rating: 8.2 },
        { id: "arg-2", name: "Nahuel Molina", number: 26, position: "RB", x: 22, y: 85, rating: 7.0 },
        { id: "arg-3", name: "Cristian Romero", number: 13, position: "CB", x: 20, y: 62, rating: 7.4 },
        { id: "arg-4", name: "Nicolás Otamendi", number: 19, position: "CB", x: 20, y: 38, rating: 7.3 },
        { id: "arg-5", name: "Nicolás Tagliafico", number: 3, position: "LB", x: 22, y: 15, rating: 7.1 },
        { id: "arg-6", name: "Rodrigo De Paul", number: 7, position: "CM", x: 35, y: 65, rating: 7.6 },
        { id: "arg-7", name: "Enzo Fernández", number: 24, position: "CM", x: 34, y: 38, rating: 7.5 },
        { id: "arg-8", name: "Alexis Mac Allister", number: 20, position: "CM", x: 40, y: 50, rating: 8.0 },
        { id: "arg-9", name: "Ángel Di María", number: 11, position: "LW", x: 48, y: 20, rating: 9.0 },
        { id: "arg-10", name: "Lionel Messi", number: 10, position: "RW", x: 48, y: 70, rating: 9.4 },
        { id: "arg-11", name: "Julián Álvarez", number: 9, position: "ST", x: 49, y: 50, rating: 7.2 }
      ],
      substitutes: [
        { id: "arg-12", name: "Marcos Acuña", number: 8, position: "LB", x: 22, y: 15 },
        { id: "arg-13", name: "Gonzalo Montiel", number: 4, position: "RB", x: 22, y: 85 },
        { id: "arg-14", name: "Lautaro Martínez", number: 22, position: "ST", x: 49, y: 50 },
        { id: "arg-15", name: "Leandro Paredes", number: 5, position: "CM", x: 34, y: 50 }
      ]
    },
    awayTeam: {
      id: "fra",
      name: "France",
      shortName: "FRA",
      color: "#1A2A6C",
      accent: "#E4002B",
      formation: "4-2-3-1",
      manager: "Didier Deschamps",
      lineup: [
        { id: "fra-1", name: "Hugo Lloris", number: 1, position: "GK", x: 5, y: 50, rating: 6.6 },
        { id: "fra-2", name: "Jules Koundé", number: 5, position: "RB", x: 22, y: 85, rating: 6.4 },
        { id: "fra-3", name: "Raphaël Varane", number: 4, position: "CB", x: 20, y: 62, rating: 6.5 },
        { id: "fra-4", name: "Dayot Upamecano", number: 18, position: "CB", x: 20, y: 38, rating: 6.3 },
        { id: "fra-5", name: "Théo Hernández", number: 22, position: "LB", x: 22, y: 15, rating: 6.5 },
        { id: "fra-6", name: "Aurélien Tchouaméni", number: 8, position: "DM", x: 32, y: 58, rating: 6.7 },
        { id: "fra-7", name: "Adrien Rabiot", number: 14, position: "CM", x: 33, y: 42, rating: 6.4 },
        { id: "fra-8", name: "Ousmane Dembélé", number: 11, position: "RW", x: 46, y: 80, rating: 5.9 },
        { id: "fra-9", name: "Antoine Griezmann", number: 7, position: "AM", x: 42, y: 50, rating: 6.8 },
        { id: "fra-10", name: "Kylian Mbappé", number: 10, position: "LW", x: 48, y: 22, rating: 9.2 },
        { id: "fra-11", name: "Olivier Giroud", number: 9, position: "ST", x: 49, y: 50, rating: 5.8 }
      ],
      substitutes: [
        { id: "fra-12", name: "Randal Kolo Muani", number: 12, position: "ST", x: 49, y: 50 },
        { id: "fra-13", name: "Marcus Thuram", number: 26, position: "ST", x: 48, y: 70 },
        { id: "fra-14", name: "Kingsley Coman", number: 20, position: "RW", x: 46, y: 80 },
        { id: "fra-15", name: "Eduardo Camavinga", number: 25, position: "LB", x: 22, y: 15 }
      ]
    },
    stats: {
      possession: [54, 46],
      shots: [21, 15],
      shotsOnTarget: [7, 6],
      xg: [2.3, 2.7],
      passes: [659, 525],
      passAccuracy: [87, 83],
      corners: [7, 4],
      fouls: [16, 21],
      offsides: [3, 5],
      yellowCards: [4, 3],
      redCards: [0, 0]
    },
    events: [
      { id: "wc-e1", minute: 23, type: "penalty-goal", side: "home", player: "Lionel Messi", detail: "Penalty won by Di María, calmly slotted low to the left", x: 88, y: 50 },
      { id: "wc-e2", minute: 36, type: "goal", side: "home", player: "Ángel Di María", assist: "Alexis Mac Allister", detail: "Sublime four-pass counter finished at the back post", x: 90, y: 30 },
      { id: "wc-e3", minute: 41, type: "substitution", side: "away", player: "Randal Kolo Muani", playerOff: "Olivier Giroud", detail: "Deschamps' bold 41st-minute double change", x: 50, y: 50 },
      { id: "wc-e4", minute: 41, type: "substitution", side: "away", player: "Marcus Thuram", playerOff: "Ousmane Dembélé", detail: "Fresh legs injected after a flat first half", x: 50, y: 50 },
      { id: "wc-e5", minute: 71, type: "offside", side: "away", player: "Kylian Mbappé", detail: "Mbappé flagged narrowly offside racing onto a through ball", x: 80, y: 25 },
      { id: "wc-e6", minute: 80, type: "penalty-goal", side: "away", player: "Kylian Mbappé", detail: "Penalty for a foul on Kolo Muani, hammered home", x: 88, y: 50 },
      { id: "wc-e7", minute: 81, type: "goal", side: "away", player: "Kylian Mbappé", assist: "Marcus Thuram", detail: "Stunning first-time volley 97 seconds later — 2-2", x: 89, y: 58 },
      { id: "wc-e8", minute: 108, type: "goal", side: "home", player: "Lionel Messi", detail: "Bundled in from close range after Lautaro's saved shot", x: 92, y: 48 },
      { id: "wc-e9", minute: 118, type: "penalty-goal", side: "away", player: "Kylian Mbappé", detail: "Hat-trick penalty after a handball — 3-3, the first WC final hat-trick since 1966", x: 88, y: 50 },
      { id: "wc-e10", minute: 120, type: "var", side: "home", player: "Lautaro Martínez", detail: "Martínez header superbly saved by Lloris in the dying seconds", x: 91, y: 52 }
    ],
    momentum: [
      { minute: 0, value: 5 },
      { minute: 15, value: 30 },
      { minute: 23, value: 55 },
      { minute: 36, value: 70 },
      { minute: 45, value: 60 },
      { minute: 60, value: 35 },
      { minute: 75, value: 5 },
      { minute: 80, value: -45 },
      { minute: 81, value: -75 },
      { minute: 90, value: -40 },
      { minute: 105, value: 10 },
      { minute: 108, value: 55 },
      { minute: 118, value: -60 },
      { minute: 120, value: -5 }
    ],
    heatmap: {
      home: [
        { x: 35, y: 50, intensity: 0.6 },
        { x: 55, y: 70, intensity: 0.8 },
        { x: 70, y: 30, intensity: 0.7 },
        { x: 80, y: 55, intensity: 0.5 }
      ],
      away: [
        { x: 30, y: 40, intensity: 0.5 },
        { x: 50, y: 25, intensity: 0.8 },
        { x: 70, y: 20, intensity: 0.9 },
        { x: 60, y: 60, intensity: 0.4 }
      ]
    }
  },
  {
    id: "ucl-2005-final",
    competition: "UEFA Champions League",
    stage: "Final — The Miracle of Istanbul",
    date: "2005-05-25",
    venue: "Atatürk Olympic Stadium",
    city: "Istanbul, Turkey",
    status: "PEN",
    result: "Liverpool win 3-2 on penalties (3-3 AET)",
    headline: "Three goals in six second-half minutes complete the greatest final comeback",
    score: { home: 3, away: 3, halfTime: [0, 3] },
    homeTeam: {
      id: "liv",
      name: "Liverpool",
      shortName: "LIV",
      color: "#C8102E",
      accent: "#00B2A9",
      formation: "3-5-2",
      manager: "Rafael Benítez",
      lineup: [
        { id: "liv-1", name: "Jerzy Dudek", number: 1, position: "GK", x: 5, y: 50, rating: 8.5 },
        { id: "liv-2", name: "Steve Finnan", number: 3, position: "RB", x: 24, y: 82, rating: 6.8 },
        { id: "liv-3", name: "Jamie Carragher", number: 23, position: "CB", x: 18, y: 60, rating: 8.0 },
        { id: "liv-4", name: "Sami Hyypiä", number: 4, position: "CB", x: 18, y: 40, rating: 7.6 },
        { id: "liv-5", name: "Djimi Traoré", number: 18, position: "LB", x: 24, y: 18, rating: 7.0 },
        { id: "liv-6", name: "Steven Gerrard", number: 8, position: "CM", x: 42, y: 60, rating: 9.3 },
        { id: "liv-7", name: "Xabi Alonso", number: 14, position: "CM", x: 36, y: 45, rating: 8.4 },
        { id: "liv-8", name: "Luis García", number: 10, position: "AM", x: 46, y: 35, rating: 7.2 },
        { id: "liv-9", name: "John Arne Riise", number: 6, position: "LM", x: 40, y: 20, rating: 6.9 },
        { id: "liv-10", name: "Harry Kewell", number: 7, position: "ST", x: 48, y: 60, rating: 5.5 },
        { id: "liv-11", name: "Milan Baroš", number: 5, position: "ST", x: 49, y: 45, rating: 6.7 }
      ],
      substitutes: [
        { id: "liv-12", name: "Dietmar Hamann", number: 16, position: "DM", x: 34, y: 50 },
        { id: "liv-13", name: "Vladimír Šmicer", number: 11, position: "MF", x: 44, y: 40 },
        { id: "liv-14", name: "Djibril Cissé", number: 9, position: "ST", x: 49, y: 50 }
      ]
    },
    awayTeam: {
      id: "mil",
      name: "AC Milan",
      shortName: "MIL",
      color: "#FB090B",
      accent: "#000000",
      formation: "4-4-1-1",
      manager: "Carlo Ancelotti",
      lineup: [
        { id: "mil-1", name: "Dida", number: 1, position: "GK", x: 5, y: 50, rating: 6.4 },
        { id: "mil-2", name: "Cafu", number: 2, position: "RB", x: 24, y: 82, rating: 6.8 },
        { id: "mil-3", name: "Jaap Stam", number: 31, position: "CB", x: 18, y: 60, rating: 6.9 },
        { id: "mil-4", name: "Alessandro Nesta", number: 13, position: "CB", x: 18, y: 40, rating: 6.7 },
        { id: "mil-5", name: "Paolo Maldini", number: 3, position: "LB", x: 24, y: 18, rating: 7.0 },
        { id: "mil-6", name: "Gennaro Gattuso", number: 8, position: "CM", x: 36, y: 62, rating: 6.5 },
        { id: "mil-7", name: "Andrea Pirlo", number: 21, position: "DM", x: 34, y: 45, rating: 7.2 },
        { id: "mil-8", name: "Clarence Seedorf", number: 10, position: "CM", x: 40, y: 30, rating: 6.6 },
        { id: "mil-9", name: "Kaká", number: 22, position: "AM", x: 46, y: 50, rating: 8.6 },
        { id: "mil-10", name: "Hernán Crespo", number: 11, position: "ST", x: 49, y: 55, rating: 8.8 },
        { id: "mil-11", name: "Andriy Shevchenko", number: 7, position: "ST", x: 49, y: 42, rating: 6.9 }
      ],
      substitutes: [
        { id: "mil-12", name: "Jon Dahl Tomasson", number: 9, position: "ST", x: 49, y: 50 },
        { id: "mil-13", name: "Serginho", number: 27, position: "LM", x: 40, y: 18 },
        { id: "mil-14", name: "Rui Costa", number: 4, position: "AM", x: 46, y: 50 }
      ]
    },
    stats: {
      possession: [47, 53],
      shots: [16, 18],
      shotsOnTarget: [8, 9],
      xg: [2.1, 2.6],
      passes: [410, 470],
      passAccuracy: [78, 82],
      corners: [6, 5],
      fouls: [20, 18],
      offsides: [4, 3],
      yellowCards: [3, 2],
      redCards: [0, 0]
    },
    events: [
      { id: "is-e1", minute: 1, type: "goal", side: "away", player: "Paolo Maldini", assist: "Andrea Pirlo", detail: "Volleyed in from a Pirlo free-kick — fastest goal in a CL final at the time", x: 90, y: 50 },
      { id: "is-e2", minute: 39, type: "goal", side: "away", player: "Hernán Crespo", assist: "Andriy Shevchenko", detail: "Tap-in after a slick Milan move", x: 91, y: 52 },
      { id: "is-e3", minute: 44, type: "goal", side: "away", player: "Hernán Crespo", assist: "Kaká", detail: "Exquisite Kaká through ball, dinked over Dudek — 0-3", x: 90, y: 48 },
      { id: "is-e4", minute: 46, type: "substitution", side: "home", player: "Dietmar Hamann", playerOff: "Steve Finnan", detail: "Benítez switches to a back three at half-time — the tactical turning point", x: 50, y: 50 },
      { id: "is-e5", minute: 54, type: "goal", side: "home", player: "Steven Gerrard", assist: "John Arne Riise", detail: "Captain's towering header off a Riise cross sparks belief", x: 89, y: 55 },
      { id: "is-e6", minute: 56, type: "goal", side: "home", player: "Vladimír Šmicer", detail: "Low drive from distance squirms past Dida — 2-3", x: 84, y: 45 },
      { id: "is-e7", minute: 60, type: "penalty-goal", side: "home", player: "Xabi Alonso", detail: "Penalty saved, but Alonso rams in the rebound — 3-3 in six astonishing minutes", x: 88, y: 50 },
      { id: "is-e8", minute: 80, type: "offside", side: "away", player: "Andriy Shevchenko", detail: "Shevchenko's tap-in ruled out for a tight offside", x: 82, y: 48 },
      { id: "is-e9", minute: 117, type: "var", side: "home", player: "Jerzy Dudek", detail: "Dudek's double save from Shevchenko — 'the impossible save'", x: 8, y: 50 }
    ],
    momentum: [
      { minute: 0, value: -40 },
      { minute: 1, value: -70 },
      { minute: 20, value: -55 },
      { minute: 39, value: -75 },
      { minute: 44, value: -90 },
      { minute: 45, value: -80 },
      { minute: 54, value: 20 },
      { minute: 56, value: 55 },
      { minute: 60, value: 80 },
      { minute: 75, value: 30 },
      { minute: 90, value: 0 },
      { minute: 105, value: -10 },
      { minute: 117, value: -30 },
      { minute: 120, value: 5 }
    ],
    heatmap: {
      home: [
        { x: 30, y: 50, intensity: 0.5 },
        { x: 55, y: 60, intensity: 0.7 },
        { x: 72, y: 50, intensity: 0.8 },
        { x: 80, y: 45, intensity: 0.6 }
      ],
      away: [
        { x: 35, y: 50, intensity: 0.6 },
        { x: 55, y: 50, intensity: 0.9 },
        { x: 70, y: 52, intensity: 0.7 },
        { x: 82, y: 50, intensity: 0.5 }
      ]
    }
  },
  {
    id: "ucl-2019-anfield",
    competition: "UEFA Champions League",
    stage: "Semi-final, 2nd leg",
    date: "2019-05-07",
    venue: "Anfield",
    city: "Liverpool, England",
    status: "FT",
    result: "Liverpool win 4-3 on aggregate",
    headline: "Liverpool overturn a 3-0 deficit on a night of Anfield magic",
    score: { home: 4, away: 0, halfTime: [1, 0] },
    homeTeam: {
      id: "liv19",
      name: "Liverpool",
      shortName: "LIV",
      color: "#C8102E",
      accent: "#F6EB61",
      formation: "4-3-3",
      manager: "Jürgen Klopp",
      lineup: [
        { id: "l19-1", name: "Alisson", number: 13, position: "GK", x: 5, y: 50, rating: 7.8 },
        { id: "l19-2", name: "Trent Alexander-Arnold", number: 66, position: "RB", x: 24, y: 84, rating: 8.7 },
        { id: "l19-3", name: "Joël Matip", number: 32, position: "CB", x: 18, y: 60, rating: 7.4 },
        { id: "l19-4", name: "Virgil van Dijk", number: 4, position: "CB", x: 18, y: 40, rating: 8.2 },
        { id: "l19-5", name: "Andy Robertson", number: 26, position: "LB", x: 24, y: 16, rating: 7.5 },
        { id: "l19-6", name: "Jordan Henderson", number: 14, position: "CM", x: 38, y: 60, rating: 7.6 },
        { id: "l19-7", name: "Fabinho", number: 3, position: "DM", x: 34, y: 50, rating: 7.7 },
        { id: "l19-8", name: "Georginio Wijnaldum", number: 5, position: "CM", x: 40, y: 38, rating: 9.1 },
        { id: "l19-9", name: "Mohamed Salah", number: 11, position: "RW", x: 48, y: 78, rating: 7.0 },
        { id: "l19-10", name: "Divock Origi", number: 27, position: "ST", x: 49, y: 50, rating: 8.9 },
        { id: "l19-11", name: "Xherdan Shaqiri", number: 23, position: "LW", x: 48, y: 22, rating: 7.2 }
      ],
      substitutes: [
        { id: "l19-12", name: "Gini Wijnaldum (on 46')", number: 5, position: "CM", x: 40, y: 38 },
        { id: "l19-13", name: "James Milner", number: 7, position: "CM", x: 38, y: 50 },
        { id: "l19-14", name: "Joe Gomez", number: 12, position: "CB", x: 18, y: 50 }
      ]
    },
    awayTeam: {
      id: "bar19",
      name: "Barcelona",
      shortName: "BAR",
      color: "#A50044",
      accent: "#004D98",
      formation: "4-3-3",
      manager: "Ernesto Valverde",
      lineup: [
        { id: "b19-1", name: "Marc-André ter Stegen", number: 1, position: "GK", x: 5, y: 50, rating: 7.0 },
        { id: "b19-2", name: "Sergi Roberto", number: 20, position: "RB", x: 24, y: 84, rating: 5.8 },
        { id: "b19-3", name: "Gerard Piqué", number: 3, position: "CB", x: 18, y: 60, rating: 6.4 },
        { id: "b19-4", name: "Clément Lenglet", number: 15, position: "CB", x: 18, y: 40, rating: 6.2 },
        { id: "b19-5", name: "Jordi Alba", number: 18, position: "LB", x: 24, y: 16, rating: 5.9 },
        { id: "b19-6", name: "Sergio Busquets", number: 5, position: "DM", x: 34, y: 50, rating: 6.5 },
        { id: "b19-7", name: "Arturo Vidal", number: 22, position: "CM", x: 40, y: 62, rating: 6.0 },
        { id: "b19-8", name: "Ivan Rakitić", number: 4, position: "CM", x: 40, y: 38, rating: 6.1 },
        { id: "b19-9", name: "Lionel Messi", number: 10, position: "RW", x: 48, y: 70, rating: 6.8 },
        { id: "b19-10", name: "Luis Suárez", number: 9, position: "ST", x: 49, y: 50, rating: 6.3 },
        { id: "b19-11", name: "Philippe Coutinho", number: 7, position: "LW", x: 48, y: 24, rating: 5.7 }
      ],
      substitutes: [
        { id: "b19-12", name: "Ousmane Dembélé", number: 11, position: "RW", x: 48, y: 70 },
        { id: "b19-13", name: "Nélson Semedo", number: 2, position: "RB", x: 24, y: 84 },
        { id: "b19-14", name: "Malcom", number: 14, position: "LW", x: 48, y: 24 }
      ]
    },
    stats: {
      possession: [46, 54],
      shots: [12, 10],
      shotsOnTarget: [7, 4],
      xg: [2.4, 1.0],
      passes: [430, 560],
      passAccuracy: [80, 86],
      corners: [9, 3],
      fouls: [12, 14],
      offsides: [2, 4],
      yellowCards: [2, 3],
      redCards: [0, 0]
    },
    events: [
      { id: "an-e1", minute: 7, type: "goal", side: "home", player: "Divock Origi", assist: "Jordan Henderson", detail: "Origi pounces on a rebound after Henderson's blocked shot", x: 90, y: 50 },
      { id: "an-e2", minute: 45, type: "offside", side: "away", player: "Luis Suárez", detail: "Suárez's effort chalked off for offside in first-half stoppage time", x: 84, y: 52 },
      { id: "an-e3", minute: 54, type: "goal", side: "home", player: "Georginio Wijnaldum", assist: "Trent Alexander-Arnold", detail: "Half-time sub scores within two minutes of the restart — 2-0", x: 88, y: 55 },
      { id: "an-e4", minute: 56, type: "goal", side: "home", player: "Georginio Wijnaldum", assist: "Xherdan Shaqiri", detail: "Towering header completes a 122-second double — 3-0, aggregate level", x: 89, y: 48 },
      { id: "an-e5", minute: 70, type: "yellow-card", side: "away", player: "Arturo Vidal", detail: "Booked for a frustrated foul as Barça lose control", x: 40, y: 55 },
      { id: "an-e6", minute: 79, type: "goal", side: "home", player: "Divock Origi", assist: "Trent Alexander-Arnold", detail: "The genius quick corner — Alexander-Arnold catches Barça napping, Origi finishes", x: 90, y: 45 },
      { id: "an-e7", minute: 85, type: "yellow-card", side: "away", player: "Jordi Alba", detail: "Caution amid Barcelona's mounting desperation", x: 30, y: 18 }
    ],
    momentum: [
      { minute: 0, value: 25 },
      { minute: 7, value: 55 },
      { minute: 20, value: 30 },
      { minute: 40, value: 35 },
      { minute: 45, value: 40 },
      { minute: 54, value: 70 },
      { minute: 56, value: 85 },
      { minute: 65, value: 60 },
      { minute: 79, value: 80 },
      { minute: 85, value: 65 },
      { minute: 90, value: 55 }
    ],
    heatmap: {
      home: [
        { x: 30, y: 50, intensity: 0.5 },
        { x: 55, y: 80, intensity: 0.8 },
        { x: 70, y: 50, intensity: 0.7 },
        { x: 82, y: 55, intensity: 0.6 }
      ],
      away: [
        { x: 35, y: 50, intensity: 0.6 },
        { x: 55, y: 45, intensity: 0.7 },
        { x: 65, y: 60, intensity: 0.5 },
        { x: 75, y: 50, intensity: 0.4 }
      ]
    }
  }
];

export function getMatch(id: string): Match | undefined {
  return matches.find((m) => m.id === id);
}

export function getEvent(matchId: string, eventId: string) {
  const match = getMatch(matchId);
  if (!match) return undefined;
  const event = match.events.find((e) => e.id === eventId);
  if (!event) return undefined;
  return { match, event };
}
