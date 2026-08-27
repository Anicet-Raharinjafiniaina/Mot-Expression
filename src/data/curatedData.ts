import { DailyEntry, Badge } from '../types';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_word',
    title: 'Premier Pas',
    titleMg: 'Dingana Voalohany',
    description: 'Avoir appris votre premier mot du jour',
    iconName: 'Footprints',
    unlocked: false,
    threshold: 1,
    type: 'words_learned',
  },
  {
    id: 'streak_3',
    title: 'Régularité de Bronze',
    titleMg: 'Fahazarana 3 andro',
    description: 'Atteindre une série de 3 jours consécutifs',
    iconName: 'Flame',
    unlocked: false,
    threshold: 3,
    type: 'streak',
  },
  {
    id: 'streak_7',
    title: 'Flamme d’Or',
    titleMg: 'Herinandro Feno (7 andro)',
    description: 'Compléter une série de 7 jours consécutifs d’apprentissage',
    iconName: 'Zap',
    unlocked: false,
    threshold: 7,
    type: 'streak',
  },
  {
    id: 'words_10',
    title: 'Explorateur de Mots',
    titleMg: 'Mpikaroka Teny (10 teny)',
    description: 'Enrichir son vocabulaire avec 10 mots maîtrisés',
    iconName: 'BookOpen',
    unlocked: false,
    threshold: 10,
    type: 'words_learned',
  },
  {
    id: 'quiz_master',
    title: 'As du Quiz',
    titleMg: 'Tompon-daka tamin’ny Fanontaniana',
    description: 'Obtenir un score parfait dans un quiz quotidien',
    iconName: 'Trophy',
    unlocked: false,
    threshold: 1,
    type: 'quiz_passed',
  },
  {
    id: 'favorites_5',
    title: 'Collectionneur',
    titleMg: 'Mpanangona Tahirin-tsoratra',
    description: 'Sauvegarder 5 mots ou expressions dans ses favoris',
    iconName: 'Bookmark',
    unlocked: false,
    threshold: 5,
    type: 'favorites_saved',
  },
];

export const CURATED_ENTRIES: DailyEntry[] = [
  {
    date: '2026-08-27',
    displayDate: {
      fr: 'Jeudi 27 Août 2026',
      en: 'Thursday, August 27, 2026',
      mg: 'Alakamisy 27 Aogositra 2026',
    },
    fr: {
      word: {
        id: 'fr-2026-08-27-w',
        date: '2026-08-27',
        language: 'fr',
        term: 'Résilience',
        partOfSpeech: 'nom féminin',
        phonetic: '/ʁe.zi.ljɑ̃s/',
        definition: 'Capacité d’un individu ou d’un groupe à surmonter les chocs traumatiques, les épreuves ou les difficultés et à se reconstruire.',
        explanation: 'Ce mot désigne la force morale et psychologique qui permet de rebondir face à l’adversité au lieu de se laisser abattre. Il s’utilise aussi bien pour les personnes que pour les sociétés ou les écosystèmes.',
        example: 'Face aux imprévus du projet, toute l’équipe a fait preuve d’une formidable résilience.',
        exampleTranslation: 'Face to unexpected project delays, the whole team demonstrated tremendous resilience.',
        synonyms: ['Fermeté', 'Persévérance', 'Ténacité', 'Endurance'],
        etymology: 'Du latin resilire (« rebondir, reculer »).',
        difficulty: 'Intermédiaire',
        tags: ['Psychologie', 'Développement', 'Force'],
        malagasy: {
          translation: 'Faharetana sy fahaizana miarina aorian’ny fisedrana',
          explanation: 'Ny « résilience » dia ny tanjaka anaty sy fahaizan’ny olona na fiarahamonina iray miatrika zava-tsarotra (olana, fahoriana, tsy fahombiazana) ka mahay mitsangana sy miarina indray fa tsy resin’ny fahakiviana.',
          exampleInMalagasy: 'Teo anoloan’ny fahasahiranana tampoka tamin’ny asa, naneho faharetana sy fahaiza-miarina lehibe ny ekipa rehetra.',
          culturalNote: 'Amin’ny fahendrena malagasy, izany no antsoina hoe faharetana tsy mety resy, toy ny fitenenana hoe: « Ny hazo avo no halan’ny rivotra, fa ny faka lalina no mampijoro azy ».',
          synonymsMalagasy: ['Faharetana', 'Fikirizana', 'Tanjaka anaty', 'Fahaiza-miarina'],
          proverbEquivalent: 'Ny herin’ny hazo, tsy ny sampany fa ny fakany.'
        }
      },
      expression: {
        id: 'fr-2026-08-27-e',
        date: '2026-08-27',
        language: 'fr',
        term: 'Avoir le cœur sur la main',
        register: 'Courant',
        origin: 'Expression apparue au XVIe siècle symbolisant la générosité sans calcul : le cœur (siège des sentiments) est tendu vers les autres.',
        explanation: 'Être extrêmement généreux, bienveillant et toujours prêt à aider son prochain sans rien attendre en retour.',
        context: 'S’utilise pour qualifier une personne altruiste, accueillante et prompte à partager ses ressources ou son temps.',
        example: 'Grand-mère a le cœur sur la main : elle prépare toujours un plat chaud pour ses voisins dans le besoin.',
        exampleTranslation: 'Grandmother is so generous: she always cooks a hot meal for neighbors in need.',
        malagasy: {
          translation: 'Malala-tanana sy tsara fanahy fatratra',
          explanation: 'Ity fitenenana ity dia enti-milaza olona tena tsara fo, mahafoy ho an’ny hafa ary vonona hanampy amin’ny fotoana rehetra tsy misy fitiavan-tena.',
          exampleInMalagasy: 'Tena malala-tanana i Bebe : mahandro sakafo mafana foana izy ho an’ireo mpiray tanàna sahirana.',
          culturalNote: 'Mifanaraka tsara amin’ny Fihavanana sy ny firaisankina malagasy izany, izay mampianatra ny fizarana sy ny fiahiana ny mpiara-belona.',
          synonymsMalagasy: ['Mora fo', 'Tia manome', 'Mahafoy', 'Tsara fanahy'],
          proverbEquivalent: 'Aza manao valala tsy mandady harona, fa manomeza amin’ny fo madio.'
        }
      }
    },
    en: {
      word: {
        id: 'en-2026-08-27-w',
        date: '2026-08-27',
        language: 'en',
        term: 'Serendipity',
        partOfSpeech: 'noun [uncountable]',
        phonetic: '/ˌser.ənˈdɪp.ə.ti/',
        definition: 'The occurrence and development of events by chance in a happy, fortunate, or beneficial way.',
        explanation: 'Making valuable discoveries by accident while looking for something completely different. It highlights positive chance and open-minded observation.',
        example: 'Finding my business partner at that random conference was pure serendipity.',
        exampleTranslation: 'Rencontrer mon associé lors de cette conférence imprévue était de la pure sérendipité.',
        frenchTranslation: 'Sérendipité — le fait de faire une découverte heureuse ou bénéfique tout à fait par hasard.',
        synonyms: ['Fortuity', 'Good fortune', 'Chance discovery', 'Coincidence'],
        etymology: 'Coined by Horace Walpole in 1754 from the Persian fairy tale "The Three Princes of Serendip".',
        difficulty: 'Avancé',
        tags: ['Chance', 'Discovery', 'Life'],
        malagasy: {
          translation: 'Vintana mahita zava-tsoa na zava-baovao tsy nampoizina',
          explanation: 'Ny « serendipity » dia zava-tsoa na fitahiana hitanao tampoka teo am-pikatsahana zavatra hafa mihitsy. Fisehoan-javatra mahafaly vokatry ny kisendrasendra mahasoa.',
          exampleInMalagasy: 'Tena vintana lehibe tsy nampoizina ny nahitako ilay mpiara-miombon’antoka tamiko tamin’iny fivoriana iny.',
          culturalNote: 'Toy ny fitenenana malagasy hoe nahita harena teny an-dalana na sendra ny soa tsy nokatsahina.',
          synonymsMalagasy: ['Vintana tsara', 'Kisendrasendra mahasoa', 'Tombontsoa tampoka'],
          proverbEquivalent: 'Ny tsara tsy mandà fiavian-tsoa.'
        }
      },
      expression: {
        id: 'en-2026-08-27-e',
        date: '2026-08-27',
        language: 'en',
        term: 'Bite the bullet',
        register: 'Courant',
        origin: 'From historical battlefield surgery where wounded soldiers bit on a lead bullet to cope with excruciating pain before anesthesia.',
        explanation: 'To decide to do something difficult, unpleasant, or painful that one has been avoiding because it is inevitable.',
        context: 'Used when someone must face a tough situation bravely and stop procrastinating.',
        example: 'I finally bit the bullet and told my boss I wanted to switch career paths.',
        exampleTranslation: 'J’ai finalement pris mon courage à deux mains et dit à mon patron que je voulais changer de voie.',
        frenchTranslation: 'Prendre son courage à deux mains — se résoudre à affronter une situation difficile ou douloureuse qui ne peut être évitée.',
        malagasy: {
          translation: 'Mandray fanapahan-kevitra sarotra amin’ny herim-po / Miaritra ny mangidy mba hahazoana ny tsara',
          explanation: 'Ity fomba fiteny ity dia manambara fahasahiana manatanteraka zavatra mampatahotra na sarotra nefa tsy maintsy atao mba hahafahana mandroso.',
          exampleInMalagasy: 'Nisahisahy foana aho, saingy tamin’ny farany dia nanapa-kevitra tamin-kerim-po nilaza tamin’ny lehibeko fa hanova lalam-piainana.',
          culturalNote: 'Maneho fahasahiana sy herin-tsaina miatrika ny sarotra, mifanaraka amin’ny ohabolana malagasy momba ny fahasahiana.',
          synonymsMalagasy: ['Mijoro am-pahatokiana', 'Miatrika ny sarotra', 'Manapa-kevitra hentitra'],
          proverbEquivalent: 'Aleo manary voan-dalana toy izay manary lalam-be.'
        }
      }
    },
    quiz: [
      {
        id: 'q-2026-08-27-1',
        type: 'definition',
        language: 'fr',
        targetTerm: 'Résilience',
        question: 'Que signifie exactement le mot « Résilience » ?',
        options: [
          'La capacité à surmonter les épreuves et à se reconstruire',
          'La tendance à abandonner facilement devant un obstacle',
          'Une technique médicale pour réparer les os brisés',
          'L’art de convaincre autrui avec diplomatie'
        ],
        correctIndex: 0,
        explanation: 'La résilience désigne la capacité psychologique et morale à rebondir après des chocs ou des difficultés.',
        malagasyExplanation: 'Ny « résilience » dia fahaizana miarina sy mitsangana matanjaka aorian’ny fisedrana sy ny zava-tsarotra.'
      },
      {
        id: 'q-2026-08-27-2',
        type: 'malagasy',
        language: 'fr',
        targetTerm: 'Avoir le cœur sur la main',
        question: 'Inona no dikan’ny fomba fiteny « Avoir le cœur sur la main » amin’ny teny malagasy ?',
        options: [
          'Malala-tanana sy tsara fanahy vonona hanampy foana',
          'Marary fo ka mitana ny tratrany amin’ny tanana',
          'Miafina sy tsy tia miresaka amin’olona',
          'Masiaka sy tia mitsara ny hafa'
        ],
        correctIndex: 0,
        explanation: '« Avoir le cœur sur la main » signifie être très généreux et prompt à aider son prochain.',
        malagasyExplanation: 'Enti-milaza olona malala-tanana, tsara fo ary tia manolotra ho an’ny hafa.'
      },
      {
        id: 'q-2026-08-27-3',
        type: 'definition',
        language: 'en',
        targetTerm: 'Serendipity',
        question: 'In English, what does "Serendipity" describe?',
        options: [
          'A fortunate discovery made entirely by unexpected chance',
          'A carefully planned scientific experiment',
          'A deep feeling of sadness and regret',
          'A state of complete chaos and confusion'
        ],
        correctIndex: 0,
        explanation: 'Serendipity is the occurrence of finding valuable or pleasant things unexpectedly.',
        malagasyExplanation: 'Ny « serendipity » dia fahafahana mahita zava-tsoa tampoka tsy nampoizina teo am-panaovana zavatra hafa.'
      },
      {
        id: 'q-2026-08-27-4',
        type: 'context',
        language: 'en',
        targetTerm: 'Bite the bullet',
        question: 'When would you use the idiom "Bite the bullet"?',
        options: [
          'When you decide to face a painful or difficult situation courageously',
          'When you are tasting delicious food at a dinner party',
          'When you are practicing target shooting with a weapon',
          'When you are refusing to listen to advice'
        ],
        correctIndex: 0,
        explanation: 'To bite the bullet means to bravely do something difficult that cannot be avoided.',
        malagasyExplanation: 'Fahasahiana miatrika sy manatanteraka zavatra sarotra na mangidy nefa tsy maintsy atao.'
      }
    ]
  },
  {
    date: '2026-08-26',
    displayDate: {
      fr: 'Mercredi 26 Août 2026',
      en: 'Wednesday, August 26, 2026',
      mg: 'Alarobia 26 Aogositra 2026',
    },
    fr: {
      word: {
        id: 'fr-2026-08-26-w',
        date: '2026-08-26',
        language: 'fr',
        term: 'Éloquence',
        partOfSpeech: 'nom féminin',
        phonetic: '/e.lɔ.kɑ̃s/',
        definition: 'Art de bien parler, d’émouvoir et de persuader par la parole ou par le style.',
        explanation: 'Désigne la maîtrise du langage et l’aisance oratoire permettant de captiver son auditoire et de transmettre des idées avec force et beauté.',
        example: 'L’éloquence de l’orateur a ému toute l’assemblée dès les premières phrases.',
        exampleTranslation: 'The speaker’s eloquence moved the entire assembly from the very first sentences.',
        synonyms: ['Rhétorique', 'Facilité d’élocution', 'Art oratoire', 'Persuasion'],
        etymology: 'Du latin eloquentia, dérivé de eloqui (« s’exprimer clairement »).',
        difficulty: 'Intermédiaire',
        tags: ['Communication', 'Discours', 'Art'],
        malagasy: {
          translation: 'Fahaizana mandaha-teny sy mambabo am-bava (Fahaiza-mikabary)',
          explanation: 'Ny « éloquence » dia ny fahaizana mampiasa teny milanto, kanto ary mandresy lahatra, mahavita manohina ny fon’ny mpihaino sy manazava hevitra amin’ny fomba mahafinaritra.',
          exampleInMalagasy: 'Nahavariana sy nanohina ny mpanatrika rehetra ny fahaizan’ilay mpikabary nandaha-teny.',
          culturalNote: 'Tena manan-danja lehibe eo amin’ny kolontsaina malagasy izany amin’ny alalan’ny Kabary sy ny fahaizana mandahatra ohabolana.',
          synonymsMalagasy: ['Fahaiza-mikabary', 'Fahaiza-mandahatra teny', 'Teny kanto'],
          proverbEquivalent: 'Ny teny toy ny fary lava vava, ka ny tsara atsipy an-doha.'
        }
      },
      expression: {
        id: 'fr-2026-08-26-e',
        date: '2026-08-26',
        language: 'fr',
        term: 'Mettre de l’eau dans son vin',
        register: 'Courant',
        origin: 'Allusion à la pratique antique de couper le vin pur avec de l’eau pour en adoucir la force alcoolique.',
        explanation: 'Modérer ses exigences, tempérer son ardeur ou ses prétentions afin de faciliter un accord ou une conciliation.',
        context: 'Utilisé lors d’une négociation ou d’un désaccord lorsqu’une personne accepte de faire des concessions.',
        example: 'Pour parvenir à un accord de paix, chaque partie a dû mettre un peu d’eau dans son vin.',
        exampleTranslation: 'To reach a peaceful agreement, each side had to tone down their demands.',
        malagasy: {
          translation: 'Mampandefitra ny hambom-po / Manaiky lembenana mba hisian’ny marimaritra iraisana',
          explanation: 'Fampihenana ny fitakiana na fampitoniana ny firehetam-po mba hahafahana mifanaraka sy mihavana amin’ny hafa.',
          exampleInMalagasy: 'Mba hisian’ny fifanarahana milamina dia tsy maintsy nampandefitra ny hambom-pony ny andaniny sy ny ankilany.',
          culturalNote: 'Mifandray amin’ny fihavanana malagasy : « Ny fandeferana no fihavanana, ary ny fihavanana no harena ».',
          synonymsMalagasy: ['Mampitony hatezerana', 'Manao marimaritra iraisana', 'Mandeferana'],
          proverbEquivalent: 'Ny fandeferana no fahendrena lehibe indrindra.'
        }
      }
    },
    en: {
      word: {
        id: 'en-2026-08-26-w',
        date: '2026-08-26',
        language: 'en',
        term: 'Eloquent',
        partOfSpeech: 'adjective',
        phonetic: '/ˈel.ə.kwənt/',
        definition: 'Fluent, graceful, and persuasive in speaking or writing.',
        explanation: 'Characterized by forceful and appropriate expression; able to express ideas effectively and beautifully.',
        example: 'She delivered an eloquent defense of human rights at the global summit.',
        exampleTranslation: 'Elle a prononcé un plaidoyer éloquent pour les droits humains au sommet mondial.',
        frenchTranslation: 'Éloquent — qui s’exprime avec aisance, fluidité et persuasion, de façon juste et belle.',
        synonyms: ['Articulate', 'Expressive', 'Persuasive', 'Silver-tongued'],
        difficulty: 'Intermédiaire',
        tags: ['Communication', 'Language', 'Speaking'],
        malagasy: {
          translation: 'Mahay mandaha-teny / Mikabary amin’ny fomba kanto sy mandresy lahatra',
          explanation: 'Enti-milaza olona mahay miteny sy manoratra amin’ny fomba madio, mazava, mambabo ary manohina ny fo.',
          exampleInMalagasy: 'Nanao lahateny nambabo fo momba ny zon’olombelona izy teo anoloan’ny mpitondra eran-tany.',
          culturalNote: 'Mitovy amin’ny olona manan-talenta amin’ny kabary sy fandaharana teny.',
          synonymsMalagasy: ['Mahay miteny', 'Kanto fiteny', 'Mpikabary mahay'],
          proverbEquivalent: 'Ny teny mahay mandamina ny tany.'
        }
      },
      expression: {
        id: 'en-2026-08-26-e',
        date: '2026-08-26',
        language: 'en',
        term: 'Break the ice',
        register: 'Courant',
        origin: 'Refers to special icebreaker ships clearing frozen navigation paths for other boats to move freely.',
        explanation: 'To do or say something that relieves tension and makes people feel more relaxed and comfortable in a social setting.',
        context: 'Ideal for meetings, first dates, social gatherings, or classroom introductions.',
        example: 'The host told a funny story to break the ice and get everyone chatting.',
        exampleTranslation: 'L’hôte a raconté une histoire drôle pour briser la glace et faire discuter tout le monde.',
        frenchTranslation: 'Briser la glace — détendre l’atmosphère et mettre à l’aise les personnes lors d’une première rencontre.',
        malagasy: {
          translation: 'Manapaka ny fahanginana / Mandrava ny henatra sy ny fahasahiranana',
          explanation: 'Fanaovana na filazana zavatra (toy ny vazivazy na fanontaniana mahafinaritra) mba hialan’ny henatra sy hahafahana mifandray malalaka.',
          exampleInMalagasy: 'Nitantara zavatra mampihomehy ilay mampiantrano mba handravana ny henatra sy hahatonga ny olona hiresaka.',
          culturalNote: 'Eo amin’ny fiaraha-monina malagasy, fanao ny fiarahabana mafana sy ny fisaorana mba hampifandray ny olona.',
          synonymsMalagasy: ['Manomboka resaka', 'Manala henatra', 'Mampifandray'],
          proverbEquivalent: 'Ny fihavanana toy ny kofehy landy, manify fa mamatotra.'
        }
      }
    },
    quiz: [
      {
        id: 'q-2026-08-26-1',
        type: 'definition',
        language: 'fr',
        targetTerm: 'Éloquence',
        question: 'Qu’est-ce que l’éloquence ?',
        options: [
          'L’art de bien s’exprimer et d’émouvoir par la parole',
          'La capacité de mémoriser de longs textes rapidement',
          'Le fait de parler plusieurs langues étrangères',
          'L’obligation de se taire en public'
        ],
        correctIndex: 0,
        explanation: 'L’éloquence est la faculté d’émouvoir, de persuader et de captiver par la beauté du discours.',
        malagasyExplanation: 'Ny « éloquence » dia fahaizana miteny sy mikabary amin’ny fomba mandresy lahatra sy kanto.'
      },
      {
        id: 'q-2026-08-26-2',
        type: 'malagasy',
        language: 'fr',
        targetTerm: 'Mettre de l’eau dans son vin',
        question: 'Inona no hevitry ny hoe « Mettre de l’eau dans son vin » ?',
        options: [
          'Mampandefitra ny hambom-po mba hisian’ny fifanarahana',
          'Misotro divay misy rano rehefa manao fety',
          'Mampitombo ny hatezerana amin’ny ady',
          'Mifindra trano tampoka'
        ],
        correctIndex: 0,
        explanation: 'Mettre de l’eau dans son vin signifie modérer ses exigences pour trouver un compromis.',
        malagasyExplanation: 'Manaiky lembenana sy mampitony fitakiana mba hahafahana mifandamina.'
      },
      {
        id: 'q-2026-08-26-3',
        type: 'context',
        language: 'en',
        targetTerm: 'Break the ice',
        question: 'Why would someone want to "break the ice" at a party?',
        options: [
          'To make guests feel comfortable and start interacting',
          'To prepare ice cubes for cold drinks',
          'To ask everyone to leave immediately',
          'To turn down the room air conditioning'
        ],
        correctIndex: 0,
        explanation: '"Break the ice" means easing social awkwardness so people converse comfortably.',
        malagasyExplanation: 'Manala henatra sy mampahazo aina ny olona mba hahafahana mifampiresaka.'
      }
    ]
  },
  {
    date: '2026-08-25',
    displayDate: {
      fr: 'Mardi 25 Août 2026',
      en: 'Tuesday, August 25, 2026',
      mg: 'Talata 25 Aogositra 2026',
    },
    fr: {
      word: {
        id: 'fr-2026-08-25-w',
        date: '2026-08-25',
        language: 'fr',
        term: 'Bienveillance',
        partOfSpeech: 'nom féminin',
        phonetic: '/bjɛ̃.vɛ.jɑ̃s/',
        definition: 'Disposition affective d’une volonté qui vise le bien et le bonheur d’autrui.',
        explanation: 'Attitude compréhensive, indulgente et attentive qui cherche à soutenir les autres sans jugement sévère.',
        example: 'Le professeur accueille chaque élève avec une grande bienveillance.',
        exampleTranslation: 'The teacher welcomes every student with immense kindness and goodwill.',
        synonyms: ['Bonté', 'Indulgence', 'Générosité', 'Sollicitude'],
        difficulty: 'Facile',
        tags: ['Valeurs', 'Société', 'Humanité'],
        malagasy: {
          translation: 'Fitiavana sy fahamoram-panahy / Fikatsahana ny soa ho an’ny hafa',
          explanation: 'Toe-po tsara sy malalaka mikatsaka mandrakariva ny hahasoa, hampandroso ary hanohana ny hafa am-pitiavana sy tsy misy fitsaratsarana poakaty.',
          exampleInMalagasy: 'Miarahaba sy mandray ny mpianatra tsirairay amin’ny fahamoram-panahy lehibe ny mpampianatra.',
          culturalNote: 'Maneho ny soatoavina malagasy momba ny fihavanana sy ny fo mahay miantra.',
          synonymsMalagasy: ['Fahamoram-panahy', 'Fo mahay miantra', 'Fitiava-namana'],
          proverbEquivalent: 'Ny soa atao levenam-bola.'
        }
      },
      expression: {
        id: 'fr-2026-08-25-e',
        date: '2026-08-25',
        language: 'fr',
        term: 'Prendre le taureau par les cornes',
        register: 'Courant',
        origin: 'Métaphore issue de la corrida ou de l’élevage où maîtriser un taureau dangereux exige de l’attraper directement par les cornes.',
        explanation: 'Affronter une situation difficile ou un problème avec détermination et sans hésiter.',
        context: 'Conseillé lorsqu’un problème traîne et qu’une action directe et courageuse s’impose.',
        example: 'Au lieu de fuir ses dettes, il a décidé de prendre le taureau par les cornes et de voir son banquier.',
        exampleTranslation: 'Instead of avoiding his debts, he decided to face the issue head-on and meet his banker.',
        malagasy: {
          translation: 'Miatrika mivantana ny olana tsy am-pisalasalana / Mandray andraikitra amin-kerim-po',
          explanation: 'Fandraisana fanapahan-kevitra hentitra sy fahasahiana miatrika olana goavana mivantana fa tsy mitsoaka na mihemotra.',
          exampleInMalagasy: 'Tsy nitsoaka ny olana izy fa sahy niatrika mivantana ny mpitantana ny banky mba handamina ny trosa.',
          culturalNote: 'Toy ny fahasahiana miatrika omby amin’ny savika na tolona malagasy.',
          synonymsMalagasy: ['Miatrika mivantana', 'Sahy mandray andraikitra', 'Tsy mihemotra'],
          proverbEquivalent: 'Ny olana tsy afenina fa atrehina.'
        }
      }
    },
    en: {
      word: {
        id: 'en-2026-08-25-w',
        date: '2026-08-25',
        language: 'en',
        term: 'Perseverance',
        partOfSpeech: 'noun [uncountable]',
        phonetic: '/ˌpɜː.sɪˈvɪə.rəns/',
        definition: 'Persistence in doing something despite difficulty or delay in achieving success.',
        explanation: 'The quality of continuing to try hard to achieve a goal even when facing obstacles and setbacks.',
        example: 'Her perseverance through years of rigorous training finally earned her the gold medal.',
        exampleTranslation: 'Sa persévérance à travers des années d’entraînement rigoureux lui a finalement valu la médaille d’or.',
        frenchTranslation: 'Persévérance — constance et ténacité à poursuivre un objectif malgré les difficultés et les échecs.',
        synonyms: ['Persistence', 'Tenacity', 'Dedication', 'Grit'],
        difficulty: 'Intermédiaire',
        tags: ['Motivation', 'Success', 'Effort'],
        malagasy: {
          translation: 'Fikirizana sy faharetana tsy mety kivy',
          explanation: 'Fomba fijery sy finiavana mitohy miasa sy miezaka mafy hahatratra ny tanjona na dia eo aza ny sakana sy ny fahasahiranana maro.',
          exampleInMalagasy: 'Ny fikirizany nandritra ny taona maro tamin’ny fiofanana no nahazoany ilay medaly volamena.',
          culturalNote: 'Mifanaraka amin’ny fahendrena malagasy mamporisika ny fiasana mafy sy ny tsy fankalavirana ny ezaka.',
          synonymsMalagasy: ['Fikirizana', 'Faharetana', 'Ezaka mitohy'],
          proverbEquivalent: 'Ny fikirizana no mitondra mankany amin’ny fandresena.'
        }
      },
      expression: {
        id: 'en-2026-08-25-e',
        date: '2026-08-25',
        language: 'en',
        term: 'Hit the nail on the head',
        register: 'Courant',
        origin: 'Carpentry metaphor: hitting the head of the nail directly produces the exact desired result efficiently.',
        explanation: 'To describe exactly what is causing a situation or problem; to be precisely right.',
        context: 'Used to agree enthusiastically with someone who has stated an insight with perfect accuracy.',
        example: 'When Sarah said communication was our main problem, she hit the nail on the head.',
        exampleTranslation: 'Quand Sarah a dit que la communication était notre problème principal, elle a mis le doigt dessus.',
        frenchTranslation: 'Mettre le doigt exactement dessus / faire mouche — dire avec une parfaite justesse ce qui est en cause.',
        malagasy: {
          translation: 'Mitifitra marina / Milaza ny tena fototry ny raharaha tsy am-piolakolana',
          explanation: 'Filazana marina sy mazava tsara ny tena fototry ny olana na ny hevitra tiana hahatongavana.',
          exampleInMalagasy: 'Rehefa nilaza i Sarah fa ny fifandraisana no tena olana, dia nitifitra marina teo amin’ny fotony izy.',
          culturalNote: 'Maneho fahiratan-tsaina sy fahitsiana amin’ny fitenenana.',
          synonymsMalagasy: ['Marina tsara', 'Nahavoa ny fotony', 'Nahitsy teny'],
          proverbEquivalent: 'Ny marina miteny ho azy.'
        }
      }
    },
    quiz: [
      {
        id: 'q-2026-08-25-1',
        type: 'definition',
        language: 'fr',
        targetTerm: 'Bienveillance',
        question: 'Quelle attitude caractérise la bienveillance ?',
        options: [
          'Une disposition favorable visant le bien et le bonheur d’autrui',
          'Une volonté de dominer et de critiquer son entourage',
          'Une indifférence totale aux problèmes des autres',
          'Une envie constante de voyager seul'
        ],
        correctIndex: 0,
        explanation: 'La bienveillance est une disposition bienveillante envers autrui marquée par l’écoute et l’empathie.',
        malagasyExplanation: 'Toe-po tsara mikatsaka ny soa sy ny fahasambaran’ny hafa am-pitiavana.'
      },
      {
        id: 'q-2026-08-25-2',
        type: 'malagasy',
        language: 'en',
        targetTerm: 'Perseverance',
        question: 'Inona no dikan’ny teny hoe "Perseverance" amin’ny teny malagasy ?',
        options: [
          'Fikirizana sy faharetana tsy mety kivy',
          'Fahatahorana sy fialana amin’ny asa',
          'Hatezerana sy tsy faharetana',
          'Fandaniam-potoana amin’ny fialam-boly'
        ],
        correctIndex: 0,
        explanation: 'Perseverance translates to persistence and determination despite difficulties.',
        malagasyExplanation: 'Ny fikirizana sy ny faharetana miasa hatramin’ny farany.'
      }
    ]
  },
  {
    date: '2026-08-24',
    displayDate: {
      fr: 'Lundi 24 Août 2026',
      en: 'Monday, August 24, 2026',
      mg: 'Alatsinainy 24 Aogositra 2026',
    },
    fr: {
      word: {
        id: 'fr-2026-08-24-w',
        date: '2026-08-24',
        language: 'fr',
        term: 'Altruisme',
        partOfSpeech: 'nom masculin',
        phonetic: '/al.tʁy.ism/',
        definition: 'Souci désintéressé du bien d’autrui ; générosité qui pousse à agir pour le bien d’un tiers sans chercher son propre profit.',
        explanation: 'Comportement caractérisé par le dévouement et la volonté de faire passer les besoins des autres avant les siens.',
        example: 'Son altruisme l’a conduit à consacrer ses week-ends à une association caritative.',
        exampleTranslation: 'His altruism led him to dedicate his weekends to a charitable organization.',
        synonyms: ['Philanthropie', 'Abnégation', 'Générosité', 'Dévouement'],
        difficulty: 'Intermédiaire',
        tags: ['Morale', 'Société', 'Entraide'],
        malagasy: {
          translation: 'Fikatsahana ny soa ho an’ny hafa alohan’ny tena / Fitiava-namana tsy misy fitiavan-tena',
          explanation: 'Ny « altruisme » dia toe-panahy mahafoy tena, mikatsaka mandrakariva ny hanampy sy hampahery ny hafa fa tsy mieritreritra tombontsoa manokana.',
          exampleInMalagasy: 'Ny fitiavany manampy ny hafa no nahatonga azy hanokana ny faran’ny herinandro rehetra ho an’ny fikambanana mpanao asa soa.',
          culturalNote: 'Tena ivon’ny fihavanana malagasy : « Ny firaisankina no hery, ary ny fifanampiana no fahasoavana ».',
          synonymsMalagasy: ['Fahafoizan-tena', 'Fitiava-namana', 'Fahatsaram-po'],
          proverbEquivalent: 'Ny manome mahazo fitahiana mihoatra noho ny mandray.'
        }
      },
      expression: {
        id: 'fr-2026-08-24-e',
        date: '2026-08-24',
        language: 'fr',
        term: 'Avoir le vent en poupe',
        register: 'Courant',
        origin: 'Terme de marine à voile : quand le vent souffle par l’arrière (la poupe), le navire avance vite et sans effort.',
        explanation: 'Être favorisé par les circonstances, connaître une période de plein succès et de réussite.',
        context: 'S’utilise pour un projet, une carrière, une entreprise ou une idée qui rencontre un succès grandissant.',
        example: 'Depuis le lancement de leur application, cette jeune start-up a vraiment le vent en poupe.',
        exampleTranslation: 'Ever since launching their app, this young startup has truly been on a roll.',
        malagasy: {
          translation: 'Mahita fahombiazana misesisesy / Mandeha tsara ny raharaha / Misy rivotra mitondra mankany amin’ny tsara',
          explanation: 'Enti-milaza olona na tetikasa mandeha tsara tokoa, tohanan’ny vintana sy ny fahombiazana amin’izao fotoana izao.',
          exampleInMalagasy: 'Hatramin’ny namoahany ilay rindranasa dia tena mahita fahombiazana lehibe ity orinasa vao misondrotra ity.',
          culturalNote: 'Toy ny hoe « mitondra rivotra tsara » na « voatahy amin’ny asa atao ».',
          synonymsMalagasy: ['Mahomby fatratra', 'Miroborobo', 'Mandeha tsara'],
          proverbEquivalent: 'Rehefa tsara ny rivotra, mandeha haingana ny lakana.'
        }
      }
    },
    en: {
      word: {
        id: 'en-2026-08-24-w',
        date: '2026-08-24',
        language: 'en',
        term: 'Altruism',
        partOfSpeech: 'noun [uncountable]',
        phonetic: '/ˈæl.tru.ɪ.zəm/',
        definition: 'The belief in or practice of selfless concern for the well-being of others.',
        explanation: 'Acting out of concern for the well-being of other people, without expecting any reward or personal advantage.',
        example: 'The volunteer’s altruism inspired the whole community to get involved.',
        exampleTranslation: 'L’altruisme du bénévole a inspiré toute la communauté à s’impliquer.',
        frenchTranslation: 'Altruisme — souci désintéressé et généreux du bien-être des autres.',
        synonyms: ['Selflessness', 'Benevolence', 'Charity', 'Compassion'],
        difficulty: 'Intermédiaire',
        tags: ['Values', 'Society', 'Humanity'],
        malagasy: {
          translation: 'Fahafoizan-tena sy fitiava-namana tsy misy tambiny',
          explanation: 'Toe-tsaina sy fihetsika mikatsaka ny tombontsoan’ny mpiara-belona alohan’ny an’ny tena manokana.',
          exampleInMalagasy: 'Nandrisika ny fokonolona rehetra handray anjara ny fahafoizan-tena nasehon’ilay mpiasa an-tsitrapo.',
          culturalNote: 'Mitovy amin’ny valin-tanana sy ny fihavanana mampiray.',
          synonymsMalagasy: ['Fahatsaram-panahy', 'Fitiava-namana', 'Fahafoizan-tena'],
          proverbEquivalent: 'Izay mahay mifampitsimbina no maharitra.'
        }
      },
      expression: {
        id: 'en-2026-08-24-e',
        date: '2026-08-24',
        language: 'en',
        term: 'Burn the midnight oil',
        register: 'Courant',
        origin: 'Before electric lighting, working late into the night required burning oil in lamps.',
        explanation: 'To read, work, or study late into the night until the early morning hours.',
        context: 'Frequently used for students studying before exams or workers meeting a tight deadline.',
        example: 'She had to burn the midnight oil to finish the quarterly financial report on time.',
        exampleTranslation: 'Elle a dû travailler tard dans la nuit pour finir le rapport financier trimestriel à temps.',
        frenchTranslation: 'Brûler la chandelle par les deux bouts — travailler ou étudier tard dans la nuit.',
        malagasy: {
          translation: 'Miasa na mianatra mafy hatramin’ny alina mandry / Miari-tory hiasa',
          explanation: 'Fiasana na fianarana mafy mandritra ny alina mba hahavitana asa na fanadinana.',
          exampleInMalagasy: 'Tsy maintsy niari-tory niasa mafy izy tamin’ny alina mba hahavita ilay tatitra ara-bola ara-potoana.',
          culturalNote: 'Fanehoana ny herim-po sy fiasana mafy eo amin’ny fivelomana sy ny fianarana.',
          synonymsMalagasy: ['Miari-tory miasa', 'Mifoha alina mianatra', 'Miezaka mafy'],
          proverbEquivalent: 'Ny alina mitondra fahombiazana ho an’izay miasa.'
        }
      }
    },
    quiz: [
      {
        id: 'q-2026-08-24-1',
        type: 'definition',
        language: 'fr',
        targetTerm: 'Altruisme',
        question: 'Que désigne le mot « Altruisme » ?',
        options: [
          'Le souci désintéressé et généreux du bien d’autrui',
          'La recherche exclusive du profit personnel',
          'La passion pour les instruments de musique anciens',
          'La peur de prendre des décisions en groupe'
        ],
        correctIndex: 0,
        explanation: 'L’altruisme est le dévouement désintéressé pour autrui.',
        malagasyExplanation: 'Fikatsahana ny hahasoa ny hafa tsy miandry valiny.'
      },
      {
        id: 'q-2026-08-24-2',
        type: 'context',
        language: 'en',
        targetTerm: 'Burn the midnight oil',
        question: 'What does someone doing when they "burn the midnight oil"?',
        options: [
          'They are working or studying late into the night',
          'They are lighting a barbecue grill',
          'They are wasting natural resources',
          'They are waking up very early at dawn'
        ],
        correctIndex: 0,
        explanation: '"Burn the midnight oil" means working diligently during late night hours.',
        malagasyExplanation: 'Miari-tory miasa na mianatra mafy mandritra ny alina.'
      }
    ]
  }
];

export function getEntryForDate(dateStr: string): DailyEntry {
  const found = CURATED_ENTRIES.find((e) => e.date === dateStr);
  if (found) return found;

  // Generate deterministic fallback based on date hash
  const hash = dateStr.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
  const index = Math.abs(hash) % CURATED_ENTRIES.length;
  const base = CURATED_ENTRIES[index];

  return {
    ...base,
    date: dateStr,
    displayDate: {
      fr: formatDateFr(dateStr),
      en: formatDateEn(dateStr),
      mg: formatDateMg(dateStr),
    },
  };
}

export function formatDateFr(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T12:00:00Z');
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateEn(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T12:00:00Z');
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateMg(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T12:00:00Z');
    const days = ['Alahady', 'Alatsinainy', 'Talata', 'Alarobia', 'Alakamisy', 'Zoma', 'Sabotsy'];
    const months = [
      'Janoary', 'Febroary', 'Martsa', 'Aprily', 'Mey', 'Jona',
      'Jolay', 'Aogositra', 'Septambra', 'Oktobra', 'Novambra', 'Desambra'
    ];
    return `${days[d.getUTCDay()]} ${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  } catch {
    return dateStr;
  }
}
