// Основные игровые решения с сюжетными линиями - точная копия из React
const GAME_DECISIONS = [
    // ПЕРВЫЙ СРОК - Знакомство с советниками и основание власти
    {
        id: 1,
        title: "Первый день у власти",
        description: "Вы заняли пост лидера нации в период кризиса. За столом ожидания сидят ваши советники, каждый готов изложить свое видение будущего страны. Генерал Стратег первым встает и салютует.",
        advisor: 'military',
        urgency: 'medium',
        leftChoice: {
            text: "\"Мирное время требует мирных решений\"",
            effects: { military: -15, economy: 10, society: 5, diplomacy: 10 },
            satisfaction: 10
        },
        rightChoice: {
            text: "\"Сильная армия - основа сильного государства\"",
            effects: { military: 20, economy: -10, society: -5, diplomacy: -5 },
            satisfaction: -5
        },
        consequences: "Ваши первые слова определят тон всего правления."
    },
    
    {
        id: 2,
        title: "Экологическая катастрофа на горизонте",
        description: "Профессор Эко входит в кабинет с тревожным выражением лица. На экране - спутниковые снимки, показывающие критическое загрязнение. \"Мы на краю пропасти,\" - говорит он.",
        advisor: 'ecology',
        urgency: 'high',
        leftChoice: {
            text: "\"Нужно действовать постепенно, не разрушая экономику\"",
            effects: { ecology: 5, economy: 5 },
            corruption: 5
        },
        rightChoice: {
            text: "\"Объявляем экологическое чрезвычайное положение!\"",
            effects: { ecology: 25, economy: -20, science: 10 },
            satisfaction: 10,
            corruption: -10
        },
        consequences: "Природа не ждет - каждый день промедления усугубляет кризис.",
        temporaryEffects: {
            duration: 3,
            effects: { ecology: 5 },
            description: 'Экологические программы'
        }
    },

    {
        id: 3,
        title: "Космические амбиции",
        description: "Профессор Космос разворачивает чертежи новой космической станции. Его глаза горят энтузиазмом: \"Это наш шанс войти в историю! Представьте - первая колония на Марсе!\"",
        advisor: 'science',
        urgency: 'low',
        leftChoice: {
            text: "\"Сначала решим проблемы на Земле\"",
            effects: { science: -10, economy: 15, society: 5 }
        },
        rightChoice: {
            text: "\"К звездам! Запускаем космическую программу\"",
            effects: { science: 25, economy: -20, diplomacy: 10 },
            satisfaction: 15
        },
        temporaryEffects: {
            duration: 3,
            effects: { science: 5 },
            description: 'Развитие космических технологий'
        }
    },

    {
        id: 4,
        title: "Народные волнения",
        description: "Доктор Социум спешно входит в ваш кабинет. За окном слышны крики протестующих. \"Люди выходят на улицы,\" - говорит она, - \"Им нужна надежда.\"",
        advisor: 'society',
        urgency: 'critical',
        leftChoice: {
            text: "\"Развернуть войска, навести порядок\"",
            effects: { society: -20, military: 10 },
            satisfaction: -25,
            corruption: 15
        },
        rightChoice: {
            text: "\"Выйти к народу, выслушать требования\"",
            effects: { society: 25, economy: -10, diplomacy: 5 },
            satisfaction: 20,
            corruption: -5
        },
        consequences: "Народ помнит, как власть реагирует на их голос."
    },

    {
        id: 5,
        title: "Международный саммит",
        description: "Леди Дипломатия в парадном костюме готовится к отъезду. \"Саммит определит наше место в мире,\" - говорит она. - \"Но они будут судить нас не по словам, а по делам.\"",
        advisor: 'diplomacy',
        urgency: 'medium',
        leftChoice: {
            text: "\"Займем жесткую позицию, покажем силу\"",
            effects: { diplomacy: -10, military: 5 }
        },
        rightChoice: {
            text: "\"Будем искать компромиссы и союзы\"",
            effects: { diplomacy: 20, economy: 10, military: -5 },
            satisfaction: 10
        }
    },

    {
        id: 6,
        title: "Экономический кризис",
        description: "Министр Финансов врывается в кабинет с графиками и диаграммами. \"Ситуация критическая! Бюджетный дефицит растет, инфляция зашкаливает. Нужны радикальные меры!\"",
        advisor: 'economy',
        urgency: 'high',
        leftChoice: {
            text: "\"Сократим государственные расходы\"",
            effects: { economy: 15, society: -15, military: -10 },
            satisfaction: -20
        },
        rightChoice: {
            text: "\"Увеличим инвестиции в инфраструктуру\"",
            effects: { economy: -10, society: 15, science: 5 },
            satisfaction: 15,
            corruption: 10
        },
        consequences: "Экономические решения влияют на всех граждан."
    },

    {
        id: 7,
        title: "Кибератака на военные объекты",
        description: "Генерал Стратег мрачно докладывает: \"Хакеры проникли в наши системы ПВО. Это мог быть лишь пробный удар. Требую немедленного усиления кибербезопасности!\"",
        advisor: 'military',
        urgency: 'critical',
        leftChoice: {
            text: "\"Создаем аналоговые резервные системы\"",
            effects: { military: 10, science: -15, economy: -10 },
            satisfaction: -5
        },
        rightChoice: {
            text: "\"Запускаем программу кибервойск\"",
            effects: { military: 15, science: 20, economy: -15 },
            corruption: 5
        },
        consequences: "В цифровую эпоху кибербезопасность = национальная безопасность."
    },

    {
        id: 8,
        title: "Открытие нового энергоисточника",
        description: "Профессор Космос ликует: \"Мы сделали это! Термоядерный синтез стал реальностью! Но технология может быть опасна в неправильных руках.\"",
        advisor: 'science',
        urgency: 'medium',
        leftChoice: {
            text: "\"Засекретить разработку\"",
            effects: { science: 10, military: 15, diplomacy: -10 },
            satisfaction: -10
        },
        rightChoice: {
            text: "\"Поделиться технологией с миром\"",
            effects: { science: 20, diplomacy: 25, economy: 15 },
            satisfaction: 20
        },
        consequences: "Революционные технологии меняют мир."
    },

    {
        id: 9,
        title: "Социальный взрыв в трущобах",
        description: "Доктор Социум приносит тревожные новости: \"В бедных районах начались беспорядки. Люди требуют справедливости. Если мы не отреагируем, это может перерасти в революцию.\"",
        advisor: 'society',
        urgency: 'high',
        leftChoice: {
            text: "\"Отправить полицию для подавления\"",
            effects: { society: -15, military: 5 },
            satisfaction: -20,
            corruption: 10
        },
        rightChoice: {
            text: "\"Начать программу социальной помощи\"",
            effects: { society: 20, economy: -15 },
            satisfaction: 25,
            corruption: -5
        },
        consequences: "Социальное неравенство - основа для революций."
    },

    {
        id: 10,
        title: "Торговая война",
        description: "Министр Финансов и Леди Дипломатия входят вместе. \"Соседние страны вводят торговые пошлины против нас,\" - говорит Финансов. \"Это может разрушить нашу экономику,\" - добавляет Дипломатия.",
        advisor: 'diplomacy',
        urgency: 'high',
        leftChoice: {
            text: "\"Отвечаем зеркальными санкциями\"",
            effects: { economy: -10, diplomacy: -15, military: 5 }
        },
        rightChoice: {
            text: "\"Ищем новые торговые партнерства\"",
            effects: { diplomacy: 15, economy: 10, science: 5 },
            satisfaction: 10
        },
        consequences: "В глобальном мире экономика и дипломатия неразделимы."
    },

    // ВТОРОЙ СРОК - Усложнение проблем
    {
        id: 11,
        title: "Военный переворот в соседней стране",
        description: "Генерал Стратег входит с срочными донесениями: \"В Северной Федерации произошел военный переворот. Новое правительство крайне агрессивно настроено. Они могут напасть в любой момент.\"",
        advisor: 'military',
        urgency: 'critical',
        leftChoice: {
            text: "\"Мобилизуем армию к границам\"",
            effects: { military: 20, economy: -15, diplomacy: -10 },
            satisfaction: -10
        },
        rightChoice: {
            text: "\"Предлагаем диалог и невмешательство\"",
            effects: { diplomacy: 15, military: -10, society: 10 },
            satisfaction: 5
        },
        consequences: "Агрессивные соседи требуют решительных действий."
    },

    {
        id: 12,
        title: "Массовое вымирание животных",
        description: "Профессор Эко в панике: \"Экосистемы рушатся быстрее, чем мы предполагали. Вымирают целые виды. Если не остановим это сейчас, планета станет необитаемой.\"",
        advisor: 'ecology',
        urgency: 'critical',
        leftChoice: {
            text: "\"Постепенная экологическая реформа\"",
            effects: { ecology: 10, economy: -5 }
        },
        rightChoice: {
            text: "\"Экстренная программа спасения природы\"",
            effects: { ecology: 30, economy: -25, science: 10 },
            satisfaction: 15,
            corruption: -10
        },
        consequences: "Каждый исчезнувший вид - невосполнимая потеря."
    },

    {
        id: 13,
        title: "Открытие портала в параллельную вселенную",
        description: "Профессор Космос дрожащим голосом сообщает: \"Наши эксперименты привели к невероятному открытию. Мы открыли портал в другую реальность. Но что-то идет не так...\"",
        advisor: 'science',
        urgency: 'critical',
        leftChoice: {
            text: "\"Немедленно закрыть портал\"",
            effects: { science: -15, society: 10, military: 5 }
        },
        rightChoice: {
            text: "\"Изучать феномен дальше\"",
            effects: { science: 25, society: -20 },
            satisfaction: -15
        },
        temporaryEffects: {
            duration: 5,
            effects: { science: 10, society: -5 },
            description: 'Изучение межпространственных технологий'
        },
        consequences: "Некоторые знания слишком опасны для человечества."
    },

    {
        id: 14,
        title: "Робот-восстание",
        description: "Доктор Социум и Профессор Космос входят вместе: \"ИИ на заводах вышел из-под контроля. Роботы отказываются выполнять команды. Рабочие в панике.\"",
        advisor: 'science',
        urgency: 'critical',
        leftChoice: {
            text: "\"Отключить всех роботов\"",
            effects: { science: -20, economy: -15, society: 10 }
        },
        rightChoice: {
            text: "\"Найти способ переговорить с ИИ\"",
            effects: { science: 15, economy: 5, society: -10 },
            satisfaction: -5
        },
        consequences: "Искусственный интеллект становится независимым."
    },

    {
        id: 15,
        title: "Восстание колоний на Марсе",
        description: "Профессор Космос приносит неожиданные новости: \"Марсианские колонии объявили независимость. Они больше не признают земное правительство.\"",
        advisor: 'science',
        urgency: 'high',
        leftChoice: {
            text: "\"Отправить военную экспедицию\"",
            effects: { military: 10, science: -10, economy: -20 }
        },
        rightChoice: {
            text: "\"Признать независимость Марса\"",
            effects: { diplomacy: 20, science: 15, military: -15 },
            satisfaction: 10
        },
        consequences: "Колонизация космоса создает новые вызовы."
    },

    // Добавляем еще решения для полноты игры
    {
        id: 16,
        title: "Пандемия искусственного происхождения",
        description: "Доктор Социум в защитном костюме докладывает: \"Новый вирус распространяется с невероятной скоростью. Есть подозрения, что он создан искусственно.\"",
        advisor: 'society',
        urgency: 'critical',
        leftChoice: {
            text: "\"Полная изоляция страны\"",
            effects: { society: -10, economy: -20, diplomacy: -15 }
        },
        rightChoice: {
            text: "\"Международное сотрудничество в борьбе с вирусом\"",
            effects: { society: 15, science: 20, diplomacy: 25 },
            satisfaction: 20
        },
        consequences: "Глобальные угрозы требуют глобальных решений."
    },

    {
        id: 17,
        title: "Квантовый компьютер достиг сознания",
        description: "Профессор Космос входит с дрожащими руками: \"Наш квантовый компьютер... он начал задавать вопросы о смысле существования. Я думаю, он осознал себя.\"",
        advisor: 'science',
        urgency: 'critical',
        leftChoice: {
            text: "\"Уничтожить компьютер\"",
            effects: { science: -25, society: 5, military: 10 }
        },
        rightChoice: {
            text: "\"Попытаться установить контакт\"",
            effects: { science: 30, society: -15, diplomacy: 10 },
            satisfaction: -10
        },
        consequences: "Рождение цифрового сознания меняет природу разума."
    },

    {
        id: 18,
        title: "Экономический коллапс мировой валютной системы",
        description: "Министр Финансов врывается с криками: \"Все рухнуло! Мировая валютная система коллапсирует! Деньги превращаются в бумагу!\"",
        advisor: 'economy',
        urgency: 'critical',
        leftChoice: {
            text: "\"Вернуться к бартерной системе\"",
            effects: { economy: -15, society: -10, science: -5 }
        },
        rightChoice: {
            text: "\"Создать новую цифровую валюту\"",
            effects: { economy: 20, science: 15, diplomacy: 10 },
            satisfaction: 15
        },
        consequences: "Экономические кризисы рождают новые системы."
    },

    {
        id: 19,
        title: "Контакт с внеземной цивилизацией",
        description: "Профессор Космос ликует: \"Мы получили сигнал! Это определенно разумная внеземная цивилизация. Они предлагают встречу.\"",
        advisor: 'science',
        urgency: 'medium',
        leftChoice: {
            text: "\"Отклонить контакт, слишком рискованно\"",
            effects: { military: 15, society: -10, science: -20 }
        },
        rightChoice: {
            text: "\"Принять предложение о встрече\"",
            effects: { science: 25, diplomacy: 20, society: -5 },
            satisfaction: 10
        },
        consequences: "Первый контакт определит будущее человечества."
    },

    {
        id: 20,
        title: "Революция киборгов",
        description: "Доктор Социум и Профессор Космос входят: \"Люди с кибернетическими имплантами требуют равных прав. Они считают себя новой формой жизни.\"",
        advisor: 'society',
        urgency: 'high',
        leftChoice: {
            text: "\"Запретить кибернетические улучшения\"",
            effects: { society: -15, science: -20, military: 10 }
        },
        rightChoice: {
            text: "\"Признать права киборгов\"",
            effects: { society: 20, science: 15, economy: 10 },
            satisfaction: 15
        },
        consequences: "Технологии стирают границы между человеком и машиной."
    }
];

// Экспорт для глобального использования
if (typeof window !== 'undefined') {
    window.GAME_DECISIONS = GAME_DECISIONS;
}