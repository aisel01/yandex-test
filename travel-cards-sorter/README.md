# JavaScript API для сортировки карточек путешественника

## Формат входных данных

API принимает на вход массив объектов. Каждый объект содержит в информацию о карточке. Он состоит из обязательных полей `originPoint` и `targetPoint`, также возможно поле `transport`.

    transport: {
        type: 'flight',
        number: 'SK455',
        seat: '3A',
        gate: '45B',
        baggageDrop: {
            auto: false,
            value: '344'
        }
    }

Если `transport.seat` отсутствует, то в ответе будет указанно "No seat assignment". Если значение `transport.baggageDrop.auto = true` , тогда в ответе указывается "Baggage will be automatically transfered from your last leg" , иначе информация о `transport.baggageDrop.value`.



## Пример входных данных
     [
            {
                originPoint: 'Madrid',
                targetPoint: 'Barselona',
                transport: {
                    type: 'train',
                    number: '78A',
                    seat: '45B'
                }
            },
            {
                originPoint: 'Gerona Airport',
                targetPoint: 'Stockholm',
                transport: {
                    type: 'flight',
                    number: 'SK455',
                    seat: '3A',
                    gate: '45B',
                    baggageDrop: {
                        auto: false,
                        value: '344'
                    }
                }
            },
            {
                originPoint: 'Barselona',
                targetPoint: 'Gerona Airport',
                transport: {
                    type: 'airport bus',
                }
            },
            {
                originPoint: 'Stockholm',
                targetPoint: 'New York JFK',
                transport: {
                    type: 'flight',
                    number: 'SK22',
                    seat: '7B',
                    gate: '22',
                    baggageDrop: {
                        auto: true
                    }
                }
            }
        ]

## Формат выходных данных

API предоставляет результат в виде массива строк,в которых описаны действия для каждой карточки.

## Пример выходных данных

    [
      "Take train 78A from Madrid to Barselona. Seat 45B. "
      "Take the airport bus from Barselona to Gerona Airport. No seat assignment."
      "From Gerona Airport, take flight SK455 to Stockholm. Gate 45B. Seat 3A. Baggage drop at ticket counter 344. "
      "From Stockholm, take flight SK22 to New York JFK. Gate 22. Seat 7B. Baggage will be automatically transfered from your last leg. "
    ]

## Использование

Подключаем файл travel-cards-sorter.js
```html
<script src="path/travel-cards-sorter.js"></script>
```
    var travelCards = new TravelCardsSorter(cards);

    travelCards.sort();

    var instructions = travelCards.getInstructions();

## Конструктор TravelCardsSorter(cards)

Принимает входные данные, проверяет их на корректность с помощью метода `TravelCardsSorter.validateData(data)`

## TravelCardsSorter.cards

Массив входных данных

## TravelCardsSorter._from & TravelCardsSorter._to

    {
      'Stockholm': {},
      'Madrid': {} ,
      ...
    }

`TravelCardsSorter._from` - это объект, в котором ключ - это город отправки, а значение - карточка, которая содержит этот ключ в качестве `originPoint`.

`TravelCardsSorter._to` - аналогично, но с городами прибытия.

## TravelCardsSorter.getStartCard()

Возвращает карточку с которой начинается путешествие. Если такой карточки нет, возвращает `false`.
Карточка считается начальной, если ее поле `originPoint` не встречается в других карточках в качестве `targetPoint`

## TravelCardsSorter.sort()

В `TravelCardsSorter.cards[0]` попадает начальная карточка,найденная с помощью `TravelCardsSorter.getStartCard()`.
`TravelCardsSorter.cards[i]` - это карточка, в которой `originPoint` совпадает с `targetPoint` предыдущей карточки `TravelCardsSorter.cards[i-1]`.

## TravelCardsSorter.getInstructions()

Метод служит для получения результата - массива с инструкциями.
Для каждой карточки вызывается метод `TravelCardsSorter.createDescription(card)`, который принимает в качестве аргумента карточку и возвращает её словесное описание.

## TravelCardsSorter.createDescription(card)

Cодержит в себе две вспомогательные функции `getBaggadeInfo(card)` и `getSeatInfo(card)`.

`getBaggadeInfo(card)` генерирует строку с информацией о багаже, в соответсвии с данными в `card.transport.bagaggeDrop`.

`getSeatInfo(card)` возврашает "Seat ..."  c номером места, если присутсвует поле `transport.seat`. В противно случае "No seat assignment".

Шаблон для описания зависит от типа транспорта. Нужный шаблон выбирается с помощью конструкции switch , которую можно расширить для новых типов транспорта, добавив новый case.

Если тип транспорта не указан, тогда результатом будет строка "Go from `originPoint` to `targetPoint` ".
