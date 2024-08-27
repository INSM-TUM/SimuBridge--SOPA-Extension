import {convertScenario} from "../../../scyllaConverter/ConvertScenario.js"
//import * as defaultTestScenarioWithCostDriversJson from "../fixtures/defaultTestScenarioWithCostDrivers.json?type=module";

const scenarioDataWithCostVariants =
    {
        "scenarioName": "PurchasingExample",
        "startingDate": "01-01-0000",
        "startingTime": "00:00",
        "numberOfInstances": 608,
        "currency": "euro",
        "resourceParameters": {
            "roles": [
                {
                    "id": "Role 1",
                    "schedule": "Role 1",
                    "costHour": 20,
                    "resources": [
                        {
                            "id": "Kim Passa"
                        },
                        {
                            "id": "Immanuel Karagianni"
                        },
                        {
                            "id": "Alberto Duport"
                        },
                        {
                            "id": "Fjodor Kowalski"
                        },
                        {
                            "id": "Esmana Liubiata"
                        },
                        {
                            "id": "Christian Francois"
                        },
                        {
                            "id": "Tesca Lobes"
                        },
                        {
                            "id": "Penn Osterwalder"
                        },
                        {
                            "id": "Nico Ojenbeer"
                        },
                        {
                            "id": "Anne Olwada"
                        },
                        {
                            "id": "Miu Hanwan"
                        },
                        {
                            "id": "Anna Kaufmann"
                        },
                        {
                            "id": "Elvira Lores"
                        },
                        {
                            "id": "Clement Duchot"
                        }
                    ]
                },
                {
                    "id": "Role 4",
                    "schedule": "Role 4",
                    "costHour": 20,
                    "resources": [
                        {
                            "id": "Maris Freeman"
                        },
                        {
                            "id": "Heinz Gutschmidt"
                        },
                        {
                            "id": "Francis Odell"
                        }
                    ]
                },
                {
                    "id": "Role 3",
                    "schedule": "Role 3",
                    "costHour": 20,
                    "resources": [
                        {
                            "id": "Karel de Groot"
                        },
                        {
                            "id": "Magdalena Predutta"
                        },
                        {
                            "id": "Francois de Perrier"
                        }
                    ]
                },
                {
                    "id": "Role 5",
                    "schedule": "Role 5",
                    "costHour": 20,
                    "resources": [
                        {
                            "id": "Karalda Nimwada"
                        },
                        {
                            "id": "Pedro Alvares"
                        }
                    ]
                },
                {
                    "id": "Role 2",
                    "schedule": "Role 2",
                    "costHour": 20,
                    "resources": [
                        {
                            "id": "Sean Manney"
                        },
                        {
                            "id": "Esmeralda Clay"
                        },
                        {
                            "id": "Carmen Finacse"
                        },
                        {
                            "id": "Karen Clarens"
                        },
                        {
                            "id": "Kiu Kan"
                        }
                    ]
                }
            ],
            "resources": [
                {
                    "id": "Kim Passa"
                },
                {
                    "id": "Immanuel Karagianni"
                },
                {
                    "id": "Alberto Duport"
                },
                {
                    "id": "Fjodor Kowalski"
                },
                {
                    "id": "Esmana Liubiata"
                },
                {
                    "id": "Christian Francois"
                },
                {
                    "id": "Tesca Lobes"
                },
                {
                    "id": "Penn Osterwalder"
                },
                {
                    "id": "Nico Ojenbeer"
                },
                {
                    "id": "Anne Olwada"
                },
                {
                    "id": "Miu Hanwan"
                },
                {
                    "id": "Anna Kaufmann"
                },
                {
                    "id": "Elvira Lores"
                },
                {
                    "id": "Clement Duchot"
                },
                {
                    "id": "Maris Freeman"
                },
                {
                    "id": "Heinz Gutschmidt"
                },
                {
                    "id": "Francis Odell"
                },
                {
                    "id": "Karel de Groot"
                },
                {
                    "id": "Magdalena Predutta"
                },
                {
                    "id": "Francois de Perrier"
                },
                {
                    "id": "Karalda Nimwada"
                },
                {
                    "id": "Pedro Alvares"
                },
                {
                    "id": "Sean Manney"
                },
                {
                    "id": "Esmeralda Clay"
                },
                {
                    "id": "Carmen Finacse"
                },
                {
                    "id": "Karen Clarens"
                },
                {
                    "id": "Kiu Kan"
                }
            ],
            "timeTables": [
                {
                    "id": "Role 1",
                    "timeTableItems": [
                        {
                            "startWeekday": "Monday",
                            "startTime": 0,
                            "endWeekday": "Monday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Tuesday",
                            "startTime": 0,
                            "endWeekday": "Tuesday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 0,
                            "endWeekday": "Wednesday",
                            "endTime": 16
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 17,
                            "endWeekday": "Wednesday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 0,
                            "endWeekday": "Thursday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Friday",
                            "startTime": 0,
                            "endWeekday": "Friday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 0,
                            "endWeekday": "Saturday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 0,
                            "endWeekday": "Sunday",
                            "endTime": 24
                        }
                    ]
                },
                {
                    "id": "Role 3",
                    "timeTableItems": [
                        {
                            "startWeekday": "Monday",
                            "startTime": 0,
                            "endWeekday": "Monday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Tuesday",
                            "startTime": 0,
                            "endWeekday": "Tuesday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 0,
                            "endWeekday": "Wednesday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 0,
                            "endWeekday": "Thursday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Friday",
                            "startTime": 0,
                            "endWeekday": "Friday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 0,
                            "endWeekday": "Saturday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 0,
                            "endWeekday": "Sunday",
                            "endTime": 24
                        }
                    ]
                },
                {
                    "id": "Role 4",
                    "timeTableItems": [
                        {
                            "startWeekday": "Monday",
                            "startTime": 4,
                            "endWeekday": "Monday",
                            "endTime": 8
                        },
                        {
                            "startWeekday": "Monday",
                            "startTime": 9,
                            "endWeekday": "Monday",
                            "endTime": 11
                        },
                        {
                            "startWeekday": "Monday",
                            "startTime": 12,
                            "endWeekday": "Monday",
                            "endTime": 13
                        },
                        {
                            "startWeekday": "Monday",
                            "startTime": 16,
                            "endWeekday": "Monday",
                            "endTime": 18
                        },
                        {
                            "startWeekday": "Monday",
                            "startTime": 19,
                            "endWeekday": "Monday",
                            "endTime": 20
                        },
                        {
                            "startWeekday": "Monday",
                            "startTime": 21,
                            "endWeekday": "Monday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Tuesday",
                            "startTime": 0,
                            "endWeekday": "Tuesday",
                            "endTime": 1
                        },
                        {
                            "startWeekday": "Tuesday",
                            "startTime": 3,
                            "endWeekday": "Tuesday",
                            "endTime": 9
                        },
                        {
                            "startWeekday": "Tuesday",
                            "startTime": 10,
                            "endWeekday": "Tuesday",
                            "endTime": 21
                        },
                        {
                            "startWeekday": "Tuesday",
                            "startTime": 22,
                            "endWeekday": "Tuesday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 0,
                            "endWeekday": "Wednesday",
                            "endTime": 3
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 7,
                            "endWeekday": "Wednesday",
                            "endTime": 8
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 9,
                            "endWeekday": "Wednesday",
                            "endTime": 12
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 13,
                            "endWeekday": "Wednesday",
                            "endTime": 15
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 17,
                            "endWeekday": "Wednesday",
                            "endTime": 19
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 20,
                            "endWeekday": "Wednesday",
                            "endTime": 22
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 23,
                            "endWeekday": "Wednesday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 0,
                            "endWeekday": "Thursday",
                            "endTime": 2
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 3,
                            "endWeekday": "Thursday",
                            "endTime": 4
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 5,
                            "endWeekday": "Thursday",
                            "endTime": 10
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 11,
                            "endWeekday": "Thursday",
                            "endTime": 13
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 14,
                            "endWeekday": "Thursday",
                            "endTime": 15
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 16,
                            "endWeekday": "Thursday",
                            "endTime": 17
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 18,
                            "endWeekday": "Thursday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Friday",
                            "startTime": 0,
                            "endWeekday": "Friday",
                            "endTime": 3
                        },
                        {
                            "startWeekday": "Friday",
                            "startTime": 4,
                            "endWeekday": "Friday",
                            "endTime": 5
                        },
                        {
                            "startWeekday": "Friday",
                            "startTime": 7,
                            "endWeekday": "Friday",
                            "endTime": 9
                        },
                        {
                            "startWeekday": "Friday",
                            "startTime": 10,
                            "endWeekday": "Friday",
                            "endTime": 13
                        },
                        {
                            "startWeekday": "Friday",
                            "startTime": 14,
                            "endWeekday": "Friday",
                            "endTime": 20
                        },
                        {
                            "startWeekday": "Friday",
                            "startTime": 21,
                            "endWeekday": "Friday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 1,
                            "endWeekday": "Saturday",
                            "endTime": 2
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 4,
                            "endWeekday": "Saturday",
                            "endTime": 7
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 9,
                            "endWeekday": "Saturday",
                            "endTime": 10
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 11,
                            "endWeekday": "Saturday",
                            "endTime": 12
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 18,
                            "endWeekday": "Saturday",
                            "endTime": 19
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 20,
                            "endWeekday": "Saturday",
                            "endTime": 21
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 22,
                            "endWeekday": "Saturday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 1,
                            "endWeekday": "Sunday",
                            "endTime": 4
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 5,
                            "endWeekday": "Sunday",
                            "endTime": 12
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 15,
                            "endWeekday": "Sunday",
                            "endTime": 16
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 17,
                            "endWeekday": "Sunday",
                            "endTime": 24
                        }
                    ]
                },
                {
                    "id": "Role 2",
                    "timeTableItems": [
                        {
                            "startWeekday": "Monday",
                            "startTime": 0,
                            "endWeekday": "Monday",
                            "endTime": 10
                        },
                        {
                            "startWeekday": "Monday",
                            "startTime": 11,
                            "endWeekday": "Monday",
                            "endTime": 16
                        },
                        {
                            "startWeekday": "Monday",
                            "startTime": 18,
                            "endWeekday": "Monday",
                            "endTime": 22
                        },
                        {
                            "startWeekday": "Monday",
                            "startTime": 23,
                            "endWeekday": "Monday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Tuesday",
                            "startTime": 0,
                            "endWeekday": "Tuesday",
                            "endTime": 7
                        },
                        {
                            "startWeekday": "Tuesday",
                            "startTime": 8,
                            "endWeekday": "Tuesday",
                            "endTime": 13
                        },
                        {
                            "startWeekday": "Tuesday",
                            "startTime": 14,
                            "endWeekday": "Tuesday",
                            "endTime": 18
                        },
                        {
                            "startWeekday": "Tuesday",
                            "startTime": 21,
                            "endWeekday": "Tuesday",
                            "endTime": 23
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 0,
                            "endWeekday": "Wednesday",
                            "endTime": 3
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 5,
                            "endWeekday": "Wednesday",
                            "endTime": 6
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 7,
                            "endWeekday": "Wednesday",
                            "endTime": 11
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 14,
                            "endWeekday": "Wednesday",
                            "endTime": 21
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 0,
                            "endWeekday": "Thursday",
                            "endTime": 1
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 2,
                            "endWeekday": "Thursday",
                            "endTime": 4
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 5,
                            "endWeekday": "Thursday",
                            "endTime": 6
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 7,
                            "endWeekday": "Thursday",
                            "endTime": 14
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 15,
                            "endWeekday": "Thursday",
                            "endTime": 18
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 19,
                            "endWeekday": "Thursday",
                            "endTime": 21
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 23,
                            "endWeekday": "Thursday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Friday",
                            "startTime": 0,
                            "endWeekday": "Friday",
                            "endTime": 17
                        },
                        {
                            "startWeekday": "Friday",
                            "startTime": 18,
                            "endWeekday": "Friday",
                            "endTime": 19
                        },
                        {
                            "startWeekday": "Friday",
                            "startTime": 20,
                            "endWeekday": "Friday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 1,
                            "endWeekday": "Saturday",
                            "endTime": 2
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 3,
                            "endWeekday": "Saturday",
                            "endTime": 5
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 6,
                            "endWeekday": "Saturday",
                            "endTime": 8
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 9,
                            "endWeekday": "Saturday",
                            "endTime": 20
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 21,
                            "endWeekday": "Saturday",
                            "endTime": 22
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 23,
                            "endWeekday": "Saturday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 0,
                            "endWeekday": "Sunday",
                            "endTime": 6
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 7,
                            "endWeekday": "Sunday",
                            "endTime": 9
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 10,
                            "endWeekday": "Sunday",
                            "endTime": 13
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 14,
                            "endWeekday": "Sunday",
                            "endTime": 17
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 18,
                            "endWeekday": "Sunday",
                            "endTime": 19
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 21,
                            "endWeekday": "Sunday",
                            "endTime": 24
                        }
                    ]
                },
                {
                    "id": "Role 5",
                    "timeTableItems": [
                        {
                            "startWeekday": "Monday",
                            "startTime": 1,
                            "endWeekday": "Monday",
                            "endTime": 2
                        },
                        {
                            "startWeekday": "Monday",
                            "startTime": 4,
                            "endWeekday": "Monday",
                            "endTime": 8
                        },
                        {
                            "startWeekday": "Monday",
                            "startTime": 11,
                            "endWeekday": "Monday",
                            "endTime": 12
                        },
                        {
                            "startWeekday": "Monday",
                            "startTime": 13,
                            "endWeekday": "Monday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Tuesday",
                            "startTime": 1,
                            "endWeekday": "Tuesday",
                            "endTime": 7
                        },
                        {
                            "startWeekday": "Tuesday",
                            "startTime": 14,
                            "endWeekday": "Tuesday",
                            "endTime": 23
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 0,
                            "endWeekday": "Wednesday",
                            "endTime": 3
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 4,
                            "endWeekday": "Wednesday",
                            "endTime": 9
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 11,
                            "endWeekday": "Wednesday",
                            "endTime": 14
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 15,
                            "endWeekday": "Wednesday",
                            "endTime": 17
                        },
                        {
                            "startWeekday": "Wednesday",
                            "startTime": 19,
                            "endWeekday": "Wednesday",
                            "endTime": 20
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 5,
                            "endWeekday": "Thursday",
                            "endTime": 12
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 13,
                            "endWeekday": "Thursday",
                            "endTime": 20
                        },
                        {
                            "startWeekday": "Thursday",
                            "startTime": 22,
                            "endWeekday": "Thursday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Friday",
                            "startTime": 1,
                            "endWeekday": "Friday",
                            "endTime": 5
                        },
                        {
                            "startWeekday": "Friday",
                            "startTime": 7,
                            "endWeekday": "Friday",
                            "endTime": 11
                        },
                        {
                            "startWeekday": "Friday",
                            "startTime": 14,
                            "endWeekday": "Friday",
                            "endTime": 18
                        },
                        {
                            "startWeekday": "Friday",
                            "startTime": 20,
                            "endWeekday": "Friday",
                            "endTime": 24
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 0,
                            "endWeekday": "Saturday",
                            "endTime": 4
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 7,
                            "endWeekday": "Saturday",
                            "endTime": 10
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 12,
                            "endWeekday": "Saturday",
                            "endTime": 20
                        },
                        {
                            "startWeekday": "Saturday",
                            "startTime": 21,
                            "endWeekday": "Saturday",
                            "endTime": 22
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 0,
                            "endWeekday": "Sunday",
                            "endTime": 2
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 4,
                            "endWeekday": "Sunday",
                            "endTime": 5
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 7,
                            "endWeekday": "Sunday",
                            "endTime": 10
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 12,
                            "endWeekday": "Sunday",
                            "endTime": 19
                        },
                        {
                            "startWeekday": "Sunday",
                            "startTime": 20,
                            "endWeekday": "Sunday",
                            "endTime": 24
                        }
                    ]
                }
            ],
            "costDrivers": [
                {
                    "id": "Delivery",
                    "concreteCostDrivers": [
                        {
                            "id": "Delivery A Lorry",
                            "cost": 0.00002843
                        },
                        {
                            "id": "Filling Material",
                            "cost": 0.00001468
                        }
                    ]
                }
            ],
            "variants": [
                {
                    "id" : "1", 
                    "name": "Shipment and delivery over distance A",
                    "frequency": "0.2",
                    "mappings": [ // TODO mappings are not done cost based anymore
                        {
                            "id": "Delivery",
                            "cost": "0.00002843"
                        },
                        {
                            "id": "Filling Material",
                            "cost": "0.00001468"

                        }

                    ]
                }
            ]
        },
        "models": [
            {
                "BPMN": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><definitions xmlns=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" targetNamespace=\"http://www.omg.org/bpmn20\" exporter=\"ProM. http://www.promtools.org/prom6\" exporterVersion=\"6.3\" xsi:schemaLocation=\"http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd\"><process id=\"proc_1486371051\">\n<startEvent id=\"node_4fa2241f-37e5-4e35-b299-1eed3f7d17df\" name=\"\"/>\n<endEvent id=\"node_c29f49b9-fe0a-4a4d-8655-bfda3b121f83\" name=\"\"/>\n<task id=\"node_d6102004-f673-4ac0-b8ab-d72fdd5dbaf8\" name=\"Settle Dispute With Supplier\"/>\n<task id=\"node_a7e3a1f7-45d7-4537-8813-06de85a343b5\" name=\"Deliver Goods Services\"/>\n<task id=\"node_10b4ebcd-7921-4098-9dc9-810e6f883b53\" name=\"Analyze Purchase Requisition\"/>\n<task id=\"node_8a158a3f-1641-4408-90b5-c655e046b1f9\" name=\"Amend Request for Quotation\"/>\n<task id=\"node_f55c287e-72cc-4759-92d5-f7b987807c7c\" name=\"Create Quotation comparison Map\"/>\n<task id=\"node_f5742608-3692-4944-b5aa-f7e1b622f1f0\" name=\"Send Request for Quotation to Supplier\"/>\n<task id=\"node_b1f5a54b-2da3-4438-a411-2d5c7fd93ef8\" name=\"Create Request for Quotation\"/>\n<task id=\"node_b902c8a3-112a-4472-8405-070dcfb99bb3\" name=\"Create Purchase Requisition\"/>\n<task id=\"node_fe5cd31c-e902-482c-9255-8de8fbe7a285\" name=\"Authorize Supplier's Invoice payment\"/>\n<task id=\"node_49c2f8fd-e0b5-415b-a16c-54d60084ad1a\" name=\"Send Invoice\"/>\n<task id=\"node_0ff3f52a-ff95-43b5-9bb9-38df1ed7c5a5\" name=\"Create Purchase Order\"/>\n<task id=\"node_8f48a10d-36c7-4338-a70e-56b9eeb4d42a\" name=\"Settle Conditions With Supplier\"/>\n<task id=\"node_a5fd3728-de66-46ca-86cc-10d17c618f06\" name=\"Choose best option\"/>\n<task id=\"node_8a010e61-09b6-44b3-93e2-cb49d81a88d4\" name=\"Confirm Purchase Order\"/>\n<task id=\"node_a4ed3ee6-10ee-466f-a0db-2271d3543d13\" name=\"Approve Purchase Order for payment\"/>\n<task id=\"node_b812a958-6271-455a-8399-ecbde089e591\" name=\"Release Purchase Order\"/>\n<task id=\"node_2ede3860-2f1f-4f05-a9e8-9b9e688b4225\" name=\"Analyze Request for Quotation\"/>\n<task id=\"node_bd6869f3-8cd8-4503-b0de-26927f7dac42\" name=\"Release Supplier's Invoice\"/>\n<task id=\"node_66c714c0-87df-4da0-9581-40a11d3e7744\" name=\"Amend Purchase Requisition\"/>\n<task id=\"node_2565e1ee-480a-4e19-b3a7-de355d9e8b62\" name=\"Pay Invoice\"/>\n<task id=\"node_67636517-ed4f-4732-96fc-8cd432a2d671\" name=\"Analyze Quotation Comparison Map\"/>\n<exclusiveGateway id=\"node_222d8dec-10a0-4797-a80b-34ea9e43c83e\" name=\"\" gatewayDirection=\"Diverging\">\n<incoming>\nnode_c0c57684-aa6e-4eb8-8f8e-0f5087f0293d</incoming>\n<outgoing>\nnode_d5e7350b-a34d-41de-81e7-9903468beef7</outgoing>\n<outgoing>\nnode_11eff71a-3374-4f8a-990a-124b45643e66</outgoing>\n</exclusiveGateway>\n<exclusiveGateway id=\"node_8e8815b3-9fe6-4cfa-ba37-fc925981980b\" name=\"\" gatewayDirection=\"Diverging\">\n<incoming>\nnode_f5415caa-d0de-4f1f-8e32-e0c3edf85afd</incoming>\n<outgoing>\nnode_5195055d-36c8-4185-a25b-dcef7825d0b4</outgoing>\n<outgoing>\nnode_1217a1b1-34b2-4559-8364-6a96a797e1cf</outgoing>\n</exclusiveGateway>\n<exclusiveGateway id=\"node_9c2f1da3-1c29-41cb-8656-92bda0c02cc0\" name=\"\" gatewayDirection=\"Converging\">\n<incoming>\nnode_818cd449-2775-49d2-95bf-5e0cdbc7ea8b</incoming>\n<incoming>\nnode_4df632ab-97c8-4856-a526-1f6a01783911</incoming>\n<outgoing>\nnode_b60d3edc-8c11-49b4-a800-7c78f7a90dbc</outgoing>\n</exclusiveGateway>\n<exclusiveGateway id=\"node_68a4b9c8-44a2-4985-93c5-c6c3ab6471f3\" name=\"\" gatewayDirection=\"Converging\">\n<incoming>\nnode_057cfe93-b8c0-4954-81ac-0752f1ca8a2f</incoming>\n<incoming>\nnode_1f800c93-9015-4647-93ff-b5467feacdfb</incoming>\n<outgoing>\nnode_e5189d75-5c33-4d29-8be1-422caddca4c0</outgoing>\n</exclusiveGateway>\n<exclusiveGateway id=\"node_b60f21a1-9fd3-4e14-adb6-0507b784311e\" name=\"\" gatewayDirection=\"Diverging\">\n<incoming>\nnode_f8034f4b-46f8-403a-a6af-9abe40f7a828</incoming>\n<outgoing>\nnode_1cf3bfa3-c8d4-4a9c-9d0b-6dd478d8f9a4</outgoing>\n<outgoing>\nnode_66fe651b-f2c7-4102-ba1e-7c39c26d03fd</outgoing>\n</exclusiveGateway>\n<exclusiveGateway id=\"node_982dd74a-da48-4ca9-890e-1523f98c5811\" name=\"\" gatewayDirection=\"Converging\">\n<incoming>\nnode_6d3e61b6-63cf-440f-8faa-0c56ad875505</incoming>\n<incoming>\nnode_d5e7350b-a34d-41de-81e7-9903468beef7</incoming>\n<outgoing>\nnode_2de8fb5b-f418-4ed9-9330-042ab9b0f6a9</outgoing>\n</exclusiveGateway>\n<sequenceFlow id=\"node_5fafd9fc-9c5a-46bd-a89d-bf4ab959c82d\" name=\"\" sourceRef=\"node_a7e3a1f7-45d7-4537-8813-06de85a343b5\" targetRef=\"node_b812a958-6271-455a-8399-ecbde089e591\"/>\n<sequenceFlow id=\"node_1d0a7982-9b4f-4bcf-ad5f-e1177b15e4f4\" name=\"\" sourceRef=\"node_a4ed3ee6-10ee-466f-a0db-2271d3543d13\" targetRef=\"node_49c2f8fd-e0b5-415b-a16c-54d60084ad1a\"/>\n<sequenceFlow id=\"node_a1f618b3-dbfe-4768-948c-65c58726444c\" name=\"\" sourceRef=\"node_f5742608-3692-4944-b5aa-f7e1b622f1f0\" targetRef=\"node_f55c287e-72cc-4759-92d5-f7b987807c7c\"/>\n<sequenceFlow id=\"node_2ef321b6-36d0-4c33-b578-4101158f3aea\" name=\"\" sourceRef=\"node_8a010e61-09b6-44b3-93e2-cb49d81a88d4\" targetRef=\"node_a7e3a1f7-45d7-4537-8813-06de85a343b5\"/>\n<sequenceFlow id=\"node_e440fa29-7a74-467d-98b2-ee698f4dfd77\" name=\"\" sourceRef=\"node_2565e1ee-480a-4e19-b3a7-de355d9e8b62\" targetRef=\"node_c29f49b9-fe0a-4a4d-8655-bfda3b121f83\"/>\n<sequenceFlow id=\"node_07acbb3a-ee37-420d-8267-af628b27fd1f\" name=\"\" sourceRef=\"node_8f48a10d-36c7-4338-a70e-56b9eeb4d42a\" targetRef=\"node_0ff3f52a-ff95-43b5-9bb9-38df1ed7c5a5\"/>\n<sequenceFlow id=\"node_8e481b7e-5b0d-405f-89dc-c2cd5c9e7774\" name=\"\" sourceRef=\"node_0ff3f52a-ff95-43b5-9bb9-38df1ed7c5a5\" targetRef=\"node_8a010e61-09b6-44b3-93e2-cb49d81a88d4\"/>\n<sequenceFlow id=\"node_13299c42-8c68-4dc5-997b-e99bf742e917\" name=\"\" sourceRef=\"node_f55c287e-72cc-4759-92d5-f7b987807c7c\" targetRef=\"node_67636517-ed4f-4732-96fc-8cd432a2d671\"/>\n<sequenceFlow id=\"node_563efeb5-915a-4bcb-b716-874529d29814\" name=\"\" sourceRef=\"node_fe5cd31c-e902-482c-9255-8de8fbe7a285\" targetRef=\"node_2565e1ee-480a-4e19-b3a7-de355d9e8b62\"/>\n<sequenceFlow id=\"node_11797b2e-c53a-4cd0-a880-c5740cda448c\" name=\"\" sourceRef=\"node_b812a958-6271-455a-8399-ecbde089e591\" targetRef=\"node_a4ed3ee6-10ee-466f-a0db-2271d3543d13\"/>\n<sequenceFlow id=\"node_4b5ef9d2-3b2a-4558-bc7c-674ae329250b\" name=\"\" sourceRef=\"node_49c2f8fd-e0b5-415b-a16c-54d60084ad1a\" targetRef=\"node_bd6869f3-8cd8-4503-b0de-26927f7dac42\"/>\n<sequenceFlow id=\"node_50e782ec-6dfa-4f78-afeb-060bd5d5152f\" name=\"\" sourceRef=\"node_67636517-ed4f-4732-96fc-8cd432a2d671\" targetRef=\"node_a5fd3728-de66-46ca-86cc-10d17c618f06\"/>\n<sequenceFlow id=\"node_09acae05-051f-420d-ba8d-5de33cfaaf05\" name=\"\" sourceRef=\"node_a5fd3728-de66-46ca-86cc-10d17c618f06\" targetRef=\"node_8f48a10d-36c7-4338-a70e-56b9eeb4d42a\"/>\n<sequenceFlow id=\"node_75defd73-bc54-4878-a744-6ea11bd74cd2\" name=\"\" sourceRef=\"node_4fa2241f-37e5-4e35-b299-1eed3f7d17df\" targetRef=\"node_b902c8a3-112a-4472-8405-070dcfb99bb3\"/>\n<sequenceFlow id=\"node_f5415caa-d0de-4f1f-8e32-e0c3edf85afd\" name=\"\" sourceRef=\"node_10b4ebcd-7921-4098-9dc9-810e6f883b53\" targetRef=\"node_8e8815b3-9fe6-4cfa-ba37-fc925981980b\"/>\n<sequenceFlow id=\"node_5195055d-36c8-4185-a25b-dcef7825d0b4\" name=\"\" sourceRef=\"node_8e8815b3-9fe6-4cfa-ba37-fc925981980b\" targetRef=\"node_66c714c0-87df-4da0-9581-40a11d3e7744\"/>\n<sequenceFlow id=\"node_1217a1b1-34b2-4559-8364-6a96a797e1cf\" name=\"\" sourceRef=\"node_8e8815b3-9fe6-4cfa-ba37-fc925981980b\" targetRef=\"node_b1f5a54b-2da3-4438-a411-2d5c7fd93ef8\"/>\n<sequenceFlow id=\"node_f8034f4b-46f8-403a-a6af-9abe40f7a828\" name=\"\" sourceRef=\"node_2ede3860-2f1f-4f05-a9e8-9b9e688b4225\" targetRef=\"node_b60f21a1-9fd3-4e14-adb6-0507b784311e\"/>\n<sequenceFlow id=\"node_66fe651b-f2c7-4102-ba1e-7c39c26d03fd\" name=\"\" sourceRef=\"node_b60f21a1-9fd3-4e14-adb6-0507b784311e\" targetRef=\"node_8a158a3f-1641-4408-90b5-c655e046b1f9\"/>\n<sequenceFlow id=\"node_1cf3bfa3-c8d4-4a9c-9d0b-6dd478d8f9a4\" name=\"\" sourceRef=\"node_b60f21a1-9fd3-4e14-adb6-0507b784311e\" targetRef=\"node_f5742608-3692-4944-b5aa-f7e1b622f1f0\"/>\n<sequenceFlow id=\"node_c0c57684-aa6e-4eb8-8f8e-0f5087f0293d\" name=\"\" sourceRef=\"node_bd6869f3-8cd8-4503-b0de-26927f7dac42\" targetRef=\"node_222d8dec-10a0-4797-a80b-34ea9e43c83e\"/>\n<sequenceFlow id=\"node_11eff71a-3374-4f8a-990a-124b45643e66\" name=\"\" sourceRef=\"node_222d8dec-10a0-4797-a80b-34ea9e43c83e\" targetRef=\"node_d6102004-f673-4ac0-b8ab-d72fdd5dbaf8\"/>\n<sequenceFlow id=\"node_2de8fb5b-f418-4ed9-9330-042ab9b0f6a9\" name=\"\" sourceRef=\"node_982dd74a-da48-4ca9-890e-1523f98c5811\" targetRef=\"node_fe5cd31c-e902-482c-9255-8de8fbe7a285\"/>\n<sequenceFlow id=\"node_6d3e61b6-63cf-440f-8faa-0c56ad875505\" name=\"\" sourceRef=\"node_d6102004-f673-4ac0-b8ab-d72fdd5dbaf8\" targetRef=\"node_982dd74a-da48-4ca9-890e-1523f98c5811\"/>\n<sequenceFlow id=\"node_d5e7350b-a34d-41de-81e7-9903468beef7\" name=\"\" sourceRef=\"node_222d8dec-10a0-4797-a80b-34ea9e43c83e\" targetRef=\"node_982dd74a-da48-4ca9-890e-1523f98c5811\"/>\n<sequenceFlow id=\"node_b60d3edc-8c11-49b4-a800-7c78f7a90dbc\" name=\"\" sourceRef=\"node_9c2f1da3-1c29-41cb-8656-92bda0c02cc0\" targetRef=\"node_2ede3860-2f1f-4f05-a9e8-9b9e688b4225\"/>\n<sequenceFlow id=\"node_4df632ab-97c8-4856-a526-1f6a01783911\" name=\"\" sourceRef=\"node_8a158a3f-1641-4408-90b5-c655e046b1f9\" targetRef=\"node_9c2f1da3-1c29-41cb-8656-92bda0c02cc0\"/>\n<sequenceFlow id=\"node_818cd449-2775-49d2-95bf-5e0cdbc7ea8b\" name=\"\" sourceRef=\"node_b1f5a54b-2da3-4438-a411-2d5c7fd93ef8\" targetRef=\"node_9c2f1da3-1c29-41cb-8656-92bda0c02cc0\"/>\n<sequenceFlow id=\"node_e5189d75-5c33-4d29-8be1-422caddca4c0\" name=\"\" sourceRef=\"node_68a4b9c8-44a2-4985-93c5-c6c3ab6471f3\" targetRef=\"node_10b4ebcd-7921-4098-9dc9-810e6f883b53\"/>\n<sequenceFlow id=\"node_1f800c93-9015-4647-93ff-b5467feacdfb\" name=\"\" sourceRef=\"node_66c714c0-87df-4da0-9581-40a11d3e7744\" targetRef=\"node_68a4b9c8-44a2-4985-93c5-c6c3ab6471f3\"/>\n<sequenceFlow id=\"node_057cfe93-b8c0-4954-81ac-0752f1ca8a2f\" name=\"\" sourceRef=\"node_b902c8a3-112a-4472-8405-070dcfb99bb3\" targetRef=\"node_68a4b9c8-44a2-4985-93c5-c6c3ab6471f3\"/>\n</process>\n<bpmndi:BPMNDiagram id=\"id_843521111\">\n<bpmndi:BPMNPlane bpmnElement=\"proc_1486371051\">\n<bpmndi:BPMNShape bpmnElement=\"node_fe5cd31c-e902-482c-9255-8de8fbe7a285\">\n<dc:Bounds x=\"2736.0\" y=\"141.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_2565e1ee-480a-4e19-b3a7-de355d9e8b62\">\n<dc:Bounds x=\"2866.0\" y=\"138.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_b812a958-6271-455a-8399-ecbde089e591\">\n<dc:Bounds x=\"1936.0\" y=\"136.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_a4ed3ee6-10ee-466f-a0db-2271d3543d13\">\n<dc:Bounds x=\"2066.0\" y=\"136.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_66c714c0-87df-4da0-9581-40a11d3e7744\">\n<dc:Bounds x=\"486.0\" y=\"171.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_f55c287e-72cc-4759-92d5-f7b987807c7c\">\n<dc:Bounds x=\"1026.0\" y=\"109.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_b60f21a1-9fd3-4e14-adb6-0507b784311e\">\n<dc:Bounds x=\"821.0\" y=\"139.5\" width=\"25.0\" height=\"25.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_8f48a10d-36c7-4338-a70e-56b9eeb4d42a\">\n<dc:Bounds x=\"1416.0\" y=\"130.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_222d8dec-10a0-4797-a80b-34ea9e43c83e\">\n<dc:Bounds x=\"2456.0\" y=\"155.5\" width=\"25.0\" height=\"25.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_2ede3860-2f1f-4f05-a9e8-9b9e688b4225\">\n<dc:Bounds x=\"691.0\" y=\"127.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_b1f5a54b-2da3-4438-a411-2d5c7fd93ef8\">\n<dc:Bounds x=\"486.0\" y=\"101.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_4fa2241f-37e5-4e35-b299-1eed3f7d17df\">\n<dc:Bounds x=\"1.0\" y=\"155.5\" width=\"25.0\" height=\"25.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_f5742608-3692-4944-b5aa-f7e1b622f1f0\">\n<dc:Bounds x=\"896.0\" y=\"101.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_bd6869f3-8cd8-4503-b0de-26927f7dac42\">\n<dc:Bounds x=\"2326.0\" y=\"143.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_49c2f8fd-e0b5-415b-a16c-54d60084ad1a\">\n<dc:Bounds x=\"2196.0\" y=\"138.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_a7e3a1f7-45d7-4537-8813-06de85a343b5\">\n<dc:Bounds x=\"1806.0\" y=\"136.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_0ff3f52a-ff95-43b5-9bb9-38df1ed7c5a5\">\n<dc:Bounds x=\"1546.0\" y=\"134.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_68a4b9c8-44a2-4985-93c5-c6c3ab6471f3\">\n<dc:Bounds x=\"206.0\" y=\"157.5\" width=\"25.0\" height=\"25.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_8a158a3f-1641-4408-90b5-c655e046b1f9\">\n<dc:Bounds x=\"896.0\" y=\"171.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_c29f49b9-fe0a-4a4d-8655-bfda3b121f83\">\n<dc:Bounds x=\"2996.0\" y=\"145.5\" width=\"25.0\" height=\"25.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_982dd74a-da48-4ca9-890e-1523f98c5811\">\n<dc:Bounds x=\"2661.0\" y=\"154.5\" width=\"25.0\" height=\"25.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_10b4ebcd-7921-4098-9dc9-810e6f883b53\">\n<dc:Bounds x=\"281.0\" y=\"127.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_8e8815b3-9fe6-4cfa-ba37-fc925981980b\">\n<dc:Bounds x=\"411.0\" y=\"139.5\" width=\"25.0\" height=\"25.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_d6102004-f673-4ac0-b8ab-d72fdd5dbaf8\">\n<dc:Bounds x=\"2531.0\" y=\"127.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_67636517-ed4f-4732-96fc-8cd432a2d671\">\n<dc:Bounds x=\"1156.0\" y=\"117.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_a5fd3728-de66-46ca-86cc-10d17c618f06\">\n<dc:Bounds x=\"1286.0\" y=\"124.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_9c2f1da3-1c29-41cb-8656-92bda0c02cc0\">\n<dc:Bounds x=\"616.0\" y=\"143.5\" width=\"25.0\" height=\"25.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_8a010e61-09b6-44b3-93e2-cb49d81a88d4\">\n<dc:Bounds x=\"1676.0\" y=\"136.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNShape bpmnElement=\"node_b902c8a3-112a-4472-8405-070dcfb99bb3\">\n<dc:Bounds x=\"76.0\" y=\"148.0\" width=\"80.0\" height=\"40.0\"/>\n<bpmndi:BPMNLabel/>\n</bpmndi:BPMNShape>\n<bpmndi:BPMNEdge bpmnElement=\"node_5fafd9fc-9c5a-46bd-a89d-bf4ab959c82d\">\n<di:waypoint x=\"1846.0\" y=\"156.0\"/>\n<di:waypoint x=\"1976.0\" y=\"156.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_8e481b7e-5b0d-405f-89dc-c2cd5c9e7774\">\n<di:waypoint x=\"1586.0\" y=\"154.0\"/>\n<di:waypoint x=\"1716.0\" y=\"156.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_2de8fb5b-f418-4ed9-9330-042ab9b0f6a9\">\n<di:waypoint x=\"2673.5\" y=\"167.0\"/>\n<di:waypoint x=\"2776.0\" y=\"161.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_818cd449-2775-49d2-95bf-5e0cdbc7ea8b\">\n<di:waypoint x=\"526.0\" y=\"121.0\"/>\n<di:waypoint x=\"628.5\" y=\"156.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_75defd73-bc54-4878-a744-6ea11bd74cd2\">\n<di:waypoint x=\"13.5\" y=\"168.0\"/>\n<di:waypoint x=\"116.0\" y=\"168.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_1217a1b1-34b2-4559-8364-6a96a797e1cf\">\n<di:waypoint x=\"423.5\" y=\"152.0\"/>\n<di:waypoint x=\"526.0\" y=\"121.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_07acbb3a-ee37-420d-8267-af628b27fd1f\">\n<di:waypoint x=\"1456.0\" y=\"150.0\"/>\n<di:waypoint x=\"1586.0\" y=\"154.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_057cfe93-b8c0-4954-81ac-0752f1ca8a2f\">\n<di:waypoint x=\"116.0\" y=\"168.0\"/>\n<di:waypoint x=\"218.5\" y=\"170.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_b60d3edc-8c11-49b4-a800-7c78f7a90dbc\">\n<di:waypoint x=\"628.5\" y=\"156.0\"/>\n<di:waypoint x=\"731.0\" y=\"147.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_c0c57684-aa6e-4eb8-8f8e-0f5087f0293d\">\n<di:waypoint x=\"2366.0\" y=\"163.0\"/>\n<di:waypoint x=\"2468.5\" y=\"168.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_4df632ab-97c8-4856-a526-1f6a01783911\">\n<di:waypoint x=\"936.0\" y=\"191.0\"/>\n<di:waypoint x=\"833.5\" y=\"197.0\"/>\n<di:waypoint x=\"731.0\" y=\"197.0\"/>\n<di:waypoint x=\"628.5\" y=\"156.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_1f800c93-9015-4647-93ff-b5467feacdfb\">\n<di:waypoint x=\"526.0\" y=\"191.0\"/>\n<di:waypoint x=\"423.5\" y=\"197.0\"/>\n<di:waypoint x=\"321.0\" y=\"197.0\"/>\n<di:waypoint x=\"218.5\" y=\"170.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_6d3e61b6-63cf-440f-8faa-0c56ad875505\">\n<di:waypoint x=\"2571.0\" y=\"147.0\"/>\n<di:waypoint x=\"2673.5\" y=\"167.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_f8034f4b-46f8-403a-a6af-9abe40f7a828\">\n<di:waypoint x=\"731.0\" y=\"147.0\"/>\n<di:waypoint x=\"833.5\" y=\"152.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_11797b2e-c53a-4cd0-a880-c5740cda448c\">\n<di:waypoint x=\"1976.0\" y=\"156.0\"/>\n<di:waypoint x=\"2106.0\" y=\"156.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_563efeb5-915a-4bcb-b716-874529d29814\">\n<di:waypoint x=\"2776.0\" y=\"161.0\"/>\n<di:waypoint x=\"2906.0\" y=\"158.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_13299c42-8c68-4dc5-997b-e99bf742e917\">\n<di:waypoint x=\"1066.0\" y=\"129.0\"/>\n<di:waypoint x=\"1196.0\" y=\"137.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_2ef321b6-36d0-4c33-b578-4101158f3aea\">\n<di:waypoint x=\"1716.0\" y=\"156.0\"/>\n<di:waypoint x=\"1846.0\" y=\"156.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_50e782ec-6dfa-4f78-afeb-060bd5d5152f\">\n<di:waypoint x=\"1196.0\" y=\"137.0\"/>\n<di:waypoint x=\"1326.0\" y=\"144.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_d5e7350b-a34d-41de-81e7-9903468beef7\">\n<di:waypoint x=\"2468.5\" y=\"168.0\"/>\n<di:waypoint x=\"2571.0\" y=\"197.0\"/>\n<di:waypoint x=\"2673.5\" y=\"167.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_f5415caa-d0de-4f1f-8e32-e0c3edf85afd\">\n<di:waypoint x=\"321.0\" y=\"147.0\"/>\n<di:waypoint x=\"423.5\" y=\"152.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_e440fa29-7a74-467d-98b2-ee698f4dfd77\">\n<di:waypoint x=\"2906.0\" y=\"158.0\"/>\n<di:waypoint x=\"3008.5\" y=\"158.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_a1f618b3-dbfe-4768-948c-65c58726444c\">\n<di:waypoint x=\"936.0\" y=\"121.0\"/>\n<di:waypoint x=\"1066.0\" y=\"129.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_1d0a7982-9b4f-4bcf-ad5f-e1177b15e4f4\">\n<di:waypoint x=\"2106.0\" y=\"156.0\"/>\n<di:waypoint x=\"2236.0\" y=\"158.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_e5189d75-5c33-4d29-8be1-422caddca4c0\">\n<di:waypoint x=\"218.5\" y=\"170.0\"/>\n<di:waypoint x=\"321.0\" y=\"147.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_1cf3bfa3-c8d4-4a9c-9d0b-6dd478d8f9a4\">\n<di:waypoint x=\"833.5\" y=\"152.0\"/>\n<di:waypoint x=\"936.0\" y=\"121.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_11eff71a-3374-4f8a-990a-124b45643e66\">\n<di:waypoint x=\"2468.5\" y=\"168.0\"/>\n<di:waypoint x=\"2571.0\" y=\"147.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_66fe651b-f2c7-4102-ba1e-7c39c26d03fd\">\n<di:waypoint x=\"833.5\" y=\"152.0\"/>\n<di:waypoint x=\"936.0\" y=\"191.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_5195055d-36c8-4185-a25b-dcef7825d0b4\">\n<di:waypoint x=\"423.5\" y=\"152.0\"/>\n<di:waypoint x=\"526.0\" y=\"191.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_4b5ef9d2-3b2a-4558-bc7c-674ae329250b\">\n<di:waypoint x=\"2236.0\" y=\"158.0\"/>\n<di:waypoint x=\"2366.0\" y=\"163.0\"/>\n</bpmndi:BPMNEdge>\n<bpmndi:BPMNEdge bpmnElement=\"node_09acae05-051f-420d-ba8d-5de33cfaaf05\">\n<di:waypoint x=\"1326.0\" y=\"144.0\"/>\n<di:waypoint x=\"1456.0\" y=\"150.0\"/>\n</bpmndi:BPMNEdge>\n</bpmndi:BPMNPlane>\n</bpmndi:BPMNDiagram>\n</definitions>",
                "name": "BPMN_1",
                "modelParameter": {
                    "activities": [
                        {
                            "id": "node_d6102004-f673-4ac0-b8ab-d72fdd5dbaf8",
                            "resources": [
                                "Role 3",
                                "Role 5"
                            ],
                            "costDrivers": [
                                "Delivery"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "normal",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "mean",
                                        "value": -3.0624320547322106
                                    },
                                    {
                                        "id": "variance",
                                        "value": 0
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_a7e3a1f7-45d7-4537-8813-06de85a343b5",
                            "resources": [
                                "Role 2"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "uniform",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "lower",
                                        "value": 5160
                                    },
                                    {
                                        "id": "upper",
                                        "value": 151559.998
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_10b4ebcd-7921-4098-9dc9-810e6f883b53",
                            "resources": [
                                "Role 4"
                            ],
                            "costDrivers": [
                                "Filling Material"
                            ],

                            "cost": 0,
                            "duration": {
                                "distributionType": "normal",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "mean",
                                        "value": 0.04973055129708148
                                    },
                                    {
                                        "id": "variance",
                                        "value": 0
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_8a158a3f-1641-4408-90b5-c655e046b1f9",
                            "resources": [
                                "Role 1",
                                "Role 4"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "normal",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "mean",
                                        "value": 588.7889204152249
                                    },
                                    {
                                        "id": "variance",
                                        "value": 186.48891726326477
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_f55c287e-72cc-4759-92d5-f7b987807c7c",
                            "resources": [
                                "Role 3"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "uniform",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "lower",
                                        "value": 2279.999
                                    },
                                    {
                                        "id": "upper",
                                        "value": 24179.999
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_f5742608-3692-4944-b5aa-f7e1b622f1f0",
                            "resources": [
                                "Role 3"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "normal",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "mean",
                                        "value": -0.9016863218042561
                                    },
                                    {
                                        "id": "variance",
                                        "value": 0
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_b1f5a54b-2da3-4438-a411-2d5c7fd93ef8",
                            "resources": [
                                "Role 1",
                                "Role 4"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "normal",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "mean",
                                        "value": 579.1304275362319
                                    },
                                    {
                                        "id": "variance",
                                        "value": 137.93234348755692
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_b902c8a3-112a-4472-8405-070dcfb99bb3",
                            "resources": [
                                "Role 1"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "uniform",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "lower",
                                        "value": 300
                                    },
                                    {
                                        "id": "upper",
                                        "value": 3420
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_fe5cd31c-e902-482c-9255-8de8fbe7a285",
                            "resources": [
                                "Role 5"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "constant",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "constantValue",
                                        "value": 0
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_49c2f8fd-e0b5-415b-a16c-54d60084ad1a",
                            "resources": [
                                "Role 2"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "constant",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "constantValue",
                                        "value": 0
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_0ff3f52a-ff95-43b5-9bb9-38df1ed7c5a5",
                            "resources": [
                                "Role 3"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "uniform",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "lower",
                                        "value": 360
                                    },
                                    {
                                        "id": "upper",
                                        "value": 1140
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_8f48a10d-36c7-4338-a70e-56b9eeb4d42a",
                            "resources": [
                                "Role 3"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "uniform",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "lower",
                                        "value": 14280
                                    },
                                    {
                                        "id": "upper",
                                        "value": 67020
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_a5fd3728-de66-46ca-86cc-10d17c618f06",
                            "resources": [
                                "Role 1"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "constant",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "constantValue",
                                        "value": 0
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_8a010e61-09b6-44b3-93e2-cb49d81a88d4",
                            "resources": [
                                "Role 2"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "normal",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "mean",
                                        "value": 1091.827953405018
                                    },
                                    {
                                        "id": "variance",
                                        "value": 646.939769970795
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_a4ed3ee6-10ee-466f-a0db-2271d3543d13",
                            "resources": [
                                "Role 3"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "constant",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "constantValue",
                                        "value": 60
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_b812a958-6271-455a-8399-ecbde089e591",
                            "resources": [
                                "Role 1"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "constant",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "constantValue",
                                        "value": 60
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_2ede3860-2f1f-4f05-a9e8-9b9e688b4225",
                            "resources": [
                                "Role 3"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "normal",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "mean",
                                        "value": 1377.5888516228747
                                    },
                                    {
                                        "id": "variance",
                                        "value": 521.4428899767106
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_bd6869f3-8cd8-4503-b0de-26927f7dac42",
                            "resources": [
                                "Role 5"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "uniform",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "lower",
                                        "value": 0
                                    },
                                    {
                                        "id": "upper",
                                        "value": 420
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_66c714c0-87df-4da0-9581-40a11d3e7744",
                            "resources": [
                                "Role 1"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "uniform",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "lower",
                                        "value": 1380
                                    },
                                    {
                                        "id": "upper",
                                        "value": 3300
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_2565e1ee-480a-4e19-b3a7-de355d9e8b62",
                            "resources": [
                                "Role 5"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "uniform",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "lower",
                                        "value": 0
                                    },
                                    {
                                        "id": "upper",
                                        "value": 900
                                    }
                                ]
                            }
                        },
                        {
                            "id": "node_67636517-ed4f-4732-96fc-8cd432a2d671",
                            "resources": [
                                "Role 1"
                            ],
                            "cost": 0,
                            "duration": {
                                "distributionType": "uniform",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "lower",
                                        "value": 300
                                    },
                                    {
                                        "id": "upper",
                                        "value": 2040
                                    }
                                ]
                            }
                        }
                    ],
                    "gateways": [
                        {
                            "id": "node_222d8dec-10a0-4797-a80b-34ea9e43c83e",
                            "probabilities": {
                                "node_d5e7350b-a34d-41de-81e7-9903468beef7": 0.7811447811447811,
                                "node_11eff71a-3374-4f8a-990a-124b45643e66": 0.21885521885521886
                            }
                        },
                        {
                            "id": "node_8e8815b3-9fe6-4cfa-ba37-fc925981980b",
                            "probabilities": {
                                "node_5195055d-36c8-4185-a25b-dcef7825d0b4": 0.023323615160349854,
                                "node_1217a1b1-34b2-4559-8364-6a96a797e1cf": 0.9766763848396501
                            }
                        },
                        {
                            "id": "node_b60f21a1-9fd3-4e14-adb6-0507b784311e",
                            "probabilities": {
                                "node_1cf3bfa3-c8d4-4a9c-9d0b-6dd478d8f9a4": 0.4720812182741117,
                                "node_66fe651b-f2c7-4102-ba1e-7c39c26d03fd": 0.5279187817258884
                            }
                        }
                    ],
                    "events": [
                        {
                            "id": "node_4fa2241f-37e5-4e35-b299-1eed3f7d17df",
                            "interArrivalTime": {
                                "distributionType": "normal",
                                "timeUnit": "secs",
                                "values": [
                                    {
                                        "id": "mean",
                                        "value": -0.0012942790489140618
                                    },
                                    {
                                        "id": "variance",
                                        "value": 0
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }
// Logistics Scenario from BPMN of oLCA dataset:
const logisticsScenario = {
    "scenarioName": "logisticsScenario",
    "startingDate": "01-01-0000",
    "startingTime": "00:00",
    "numberOfInstances": 1,
    "currency": "euro",
    "resourceParameters": {
        "roles": [],
        "resources": [],
        "timeTables": [],
        "costDrivers": [
            {
                "id": "Delivery",
                "concreteCostDrivers": [
                    {
                        "id": "Delivery A Lorry",
                        "cost": 0.00002843
                    }
                ]
            },
            {
                "id": "Filling Material",
                "concreteCostDrivers": [
                    {
                        "id": "Filling A",
                        "cost": 0.0000146
                    }
                ]
            },
            {
                "id": "Packaging Material",
                "concreteCostDrivers": [
                    {
                        "id": "Packaging Material B",
                        "cost": 0.00003806
                    }
                ]
            },
            {
                "id": "Re-Routing",
                "concreteCostDrivers": [
                    {
                        "id": "Re-Routing A Lorry",
                        "cost": 0.000008529
                    },
                    {
                        "id": "Re-Routing A Small Lorry",
                        "cost": 0.00001105
                    },
                ]
            },
            {
                "id": "Receipt",
                "concreteCostDrivers": [
                    {
                        "id": "Receipt",
                        "cost": 0.00001153
                    }
                ]
            },

            {
                "id": "Shipment",
                "concreteCostDrivers": [
                    {
                        "id": "Shipment A Lorry",
                        "cost": 0.00007839
                    },
                    {
                        "id": "Shipment A Rail Electric",
                        "cost": 0.0000000253
                    },
                ]
            },

        ],
        "variants": [
            {
                "id" : "2",
                "name": "Shipment and delivery over distance A",
                "frequency": "0.2",
                "mappings": [ // TODO mappings are not done cost based anymore
                    {
                        "id": "Delivery",
                        "cost": "0.00002843"
                    },
                    {
                        "id": "Filling Material",
                        "cost": "0.00001468"
                    },
                    {
                        "id": "Packaging Material",
                        "cost": "0.00003806"
                    },
                    {
                        "id": "Re-Routing",
                        "cost": "0.000008529"
                    },
                    {
                        "id": "Receipt",
                        "cost": "0.00001153"
                    },
                    {
                        "id": "Shipment",
                        "cost": "0.00007839"
                    },


                ]
            }
        ]
    },
    "models": [
        {
            "BPMN": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<bpmn:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" id=\"Definitions_1xj4wit\" targetNamespace=\"http://bpmn.io/schema/bpmn\" exporter=\"bpmn-js (https://demo.bpmn.io)\" exporterVersion=\"14.0.0\">\n  <bpmn:process id=\"Process_0vv8a1n\" isExecutable=\"false\">\n    <bpmn:startEvent id=\"StartEvent_0gkkt3f\" name=\"Product received\">\n      <bpmn:outgoing>Flow_06fvazw</bpmn:outgoing>\n    </bpmn:startEvent>\n    <bpmn:task id=\"Activity_0e1w0fd\" name=\"Package product\">\n      <bpmn:incoming>Flow_06fvazw</bpmn:incoming>\n      <bpmn:outgoing>Flow_14q3p0k</bpmn:outgoing>\n    </bpmn:task>\n    <bpmn:sequenceFlow id=\"Flow_06fvazw\" sourceRef=\"StartEvent_0gkkt3f\" targetRef=\"Activity_0e1w0fd\" />\n    <bpmn:task id=\"Activity_1s4kdkl\" name=\"Ship product\">\n      <bpmn:incoming>Flow_14q3p0k</bpmn:incoming>\n      <bpmn:outgoing>Flow_1qnodsh</bpmn:outgoing>\n    </bpmn:task>\n    <bpmn:sequenceFlow id=\"Flow_14q3p0k\" sourceRef=\"Activity_0e1w0fd\" targetRef=\"Activity_1s4kdkl\" />\n    <bpmn:exclusiveGateway id=\"Gateway_0uo58jk\" name=\"Chosen delivery location?\">\n      <bpmn:incoming>Flow_1qnodsh</bpmn:incoming>\n      <bpmn:outgoing>Flow_0fyac79</bpmn:outgoing>\n      <bpmn:outgoing>Flow_01tzu06</bpmn:outgoing>\n    </bpmn:exclusiveGateway>\n    <bpmn:sequenceFlow id=\"Flow_1qnodsh\" sourceRef=\"Activity_1s4kdkl\" targetRef=\"Gateway_0uo58jk\" />\n    <bpmn:task id=\"Activity_0zhmejb\" name=\"Deliver to Door\">\n      <bpmn:incoming>Flow_0fyac79</bpmn:incoming>\n      <bpmn:outgoing>Flow_0xtz5ns</bpmn:outgoing>\n    </bpmn:task>\n    <bpmn:sequenceFlow id=\"Flow_0fyac79\" name=\"Door\" sourceRef=\"Gateway_0uo58jk\" targetRef=\"Activity_0zhmejb\" />\n    <bpmn:task id=\"Activity_192mexg\" name=\"Deliver to Packstation\">\n      <bpmn:incoming>Flow_01tzu06</bpmn:incoming>\n      <bpmn:outgoing>Flow_02uc4va</bpmn:outgoing>\n    </bpmn:task>\n    <bpmn:sequenceFlow id=\"Flow_01tzu06\" name=\"Packstation\" sourceRef=\"Gateway_0uo58jk\" targetRef=\"Activity_192mexg\" />\n    <bpmn:exclusiveGateway id=\"Gateway_1bzfr5k\" name=\"recipient present?\">\n      <bpmn:incoming>Flow_0xtz5ns</bpmn:incoming>\n      <bpmn:outgoing>Flow_10ggdpx</bpmn:outgoing>\n      <bpmn:outgoing>Flow_1st2x5y</bpmn:outgoing>\n    </bpmn:exclusiveGateway>\n    <bpmn:sequenceFlow id=\"Flow_0xtz5ns\" sourceRef=\"Activity_0zhmejb\" targetRef=\"Gateway_1bzfr5k\" />\n    <bpmn:exclusiveGateway id=\"Gateway_0ycinv6\">\n      <bpmn:incoming>Flow_10ggdpx</bpmn:incoming>\n      <bpmn:incoming>Flow_02uc4va</bpmn:incoming>\n      <bpmn:incoming>Flow_0w9ek07</bpmn:incoming>\n      <bpmn:outgoing>Flow_1iyh4gc</bpmn:outgoing>\n    </bpmn:exclusiveGateway>\n    <bpmn:sequenceFlow id=\"Flow_10ggdpx\" name=\"yes\" sourceRef=\"Gateway_1bzfr5k\" targetRef=\"Gateway_0ycinv6\" />\n    <bpmn:sequenceFlow id=\"Flow_02uc4va\" sourceRef=\"Activity_192mexg\" targetRef=\"Gateway_0ycinv6\" />\n    <bpmn:exclusiveGateway id=\"Gateway_17qcnbi\" name=\"Product damaged?\">\n      <bpmn:incoming>Flow_1iyh4gc</bpmn:incoming>\n      <bpmn:outgoing>Flow_13lfwjz</bpmn:outgoing>\n      <bpmn:outgoing>Flow_033an5l</bpmn:outgoing>\n    </bpmn:exclusiveGateway>\n    <bpmn:sequenceFlow id=\"Flow_1iyh4gc\" sourceRef=\"Gateway_0ycinv6\" targetRef=\"Gateway_17qcnbi\" />\n    <bpmn:endEvent id=\"Event_1al9rcd\" name=\"Product delivered sucessfully\">\n      <bpmn:incoming>Flow_13lfwjz</bpmn:incoming>\n    </bpmn:endEvent>\n    <bpmn:sequenceFlow id=\"Flow_13lfwjz\" name=\"no\" sourceRef=\"Gateway_17qcnbi\" targetRef=\"Event_1al9rcd\" />\n    <bpmn:task id=\"Activity_1gpudom\" name=\"Return product\">\n      <bpmn:incoming>Flow_033an5l</bpmn:incoming>\n      <bpmn:outgoing>Flow_07nnggp</bpmn:outgoing>\n    </bpmn:task>\n    <bpmn:sequenceFlow id=\"Flow_033an5l\" name=\"yes\" sourceRef=\"Gateway_17qcnbi\" targetRef=\"Activity_1gpudom\" />\n    <bpmn:endEvent id=\"Event_1k904t4\" name=\"Product returned\">\n      <bpmn:incoming>Flow_07nnggp</bpmn:incoming>\n    </bpmn:endEvent>\n    <bpmn:sequenceFlow id=\"Flow_07nnggp\" sourceRef=\"Activity_1gpudom\" targetRef=\"Event_1k904t4\" />\n    <bpmn:task id=\"Activity_0rem6vo\" name=\"Print and post pick-up receipt\">\n      <bpmn:incoming>Flow_1st2x5y</bpmn:incoming>\n      <bpmn:outgoing>Flow_18wmyat</bpmn:outgoing>\n    </bpmn:task>\n    <bpmn:sequenceFlow id=\"Flow_1st2x5y\" name=\"no\" sourceRef=\"Gateway_1bzfr5k\" targetRef=\"Activity_0rem6vo\" />\n    <bpmn:task id=\"Activity_0y7dygl\" name=\"Re-route to Packstation\">\n      <bpmn:incoming>Flow_18wmyat</bpmn:incoming>\n      <bpmn:outgoing>Flow_0w9ek07</bpmn:outgoing>\n    </bpmn:task>\n    <bpmn:sequenceFlow id=\"Flow_18wmyat\" sourceRef=\"Activity_0rem6vo\" targetRef=\"Activity_0y7dygl\" />\n    <bpmn:sequenceFlow id=\"Flow_0w9ek07\" sourceRef=\"Activity_0y7dygl\" targetRef=\"Gateway_0ycinv6\" />\n  </bpmn:process>\n  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_0vv8a1n\">\n      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_0gkkt3f\">\n        <dc:Bounds x=\"192\" y=\"191\" width=\"36\" height=\"36\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"169\" y=\"234\" width=\"83\" height=\"14\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_0e1w0fd_di\" bpmnElement=\"Activity_0e1w0fd\">\n        <dc:Bounds x=\"260\" y=\"169\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_1s4kdkl_di\" bpmnElement=\"Activity_1s4kdkl\">\n        <dc:Bounds x=\"380\" y=\"169\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Gateway_0uo58jk_di\" bpmnElement=\"Gateway_0uo58jk\" isMarkerVisible=\"true\">\n        <dc:Bounds x=\"515\" y=\"184\" width=\"50\" height=\"50\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"501\" y=\"154\" width=\"79\" height=\"27\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_0zhmejb_di\" bpmnElement=\"Activity_0zhmejb\">\n        <dc:Bounds x=\"630\" y=\"169\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_192mexg_di\" bpmnElement=\"Activity_192mexg\">\n        <dc:Bounds x=\"630\" y=\"260\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Gateway_1bzfr5k_di\" bpmnElement=\"Gateway_1bzfr5k\" isMarkerVisible=\"true\">\n        <dc:Bounds x=\"745\" y=\"184\" width=\"50\" height=\"50\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"746\" y=\"241\" width=\"88\" height=\"14\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Gateway_0ycinv6_di\" bpmnElement=\"Gateway_0ycinv6\" isMarkerVisible=\"true\">\n        <dc:Bounds x=\"1005\" y=\"184\" width=\"50\" height=\"50\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Gateway_17qcnbi_di\" bpmnElement=\"Gateway_17qcnbi\" isMarkerVisible=\"true\">\n        <dc:Bounds x=\"1077\" y=\"184\" width=\"50\" height=\"50\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"1078\" y=\"154\" width=\"51\" height=\"27\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Event_1al9rcd_di\" bpmnElement=\"Event_1al9rcd\">\n        <dc:Bounds x=\"1164\" y=\"191\" width=\"36\" height=\"36\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"1141\" y=\"234\" width=\"85\" height=\"27\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_1gpudom_di\" bpmnElement=\"Activity_1gpudom\">\n        <dc:Bounds x=\"1132\" y=\"280\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Event_1k904t4_di\" bpmnElement=\"Event_1k904t4\">\n        <dc:Bounds x=\"1264\" y=\"302\" width=\"36\" height=\"36\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"1241\" y=\"343\" width=\"82\" height=\"14\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_0rem6vo_di\" bpmnElement=\"Activity_0rem6vo\">\n        <dc:Bounds x=\"790\" y=\"80\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_0y7dygl_di\" bpmnElement=\"Activity_0y7dygl\">\n        <dc:Bounds x=\"910\" y=\"80\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id=\"Flow_06fvazw_di\" bpmnElement=\"Flow_06fvazw\">\n        <di:waypoint x=\"228\" y=\"209\" />\n        <di:waypoint x=\"260\" y=\"209\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_14q3p0k_di\" bpmnElement=\"Flow_14q3p0k\">\n        <di:waypoint x=\"360\" y=\"209\" />\n        <di:waypoint x=\"380\" y=\"209\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_1qnodsh_di\" bpmnElement=\"Flow_1qnodsh\">\n        <di:waypoint x=\"480\" y=\"209\" />\n        <di:waypoint x=\"515\" y=\"209\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_0fyac79_di\" bpmnElement=\"Flow_0fyac79\">\n        <di:waypoint x=\"565\" y=\"209\" />\n        <di:waypoint x=\"630\" y=\"209\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"578\" y=\"213\" width=\"24\" height=\"14\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_01tzu06_di\" bpmnElement=\"Flow_01tzu06\">\n        <di:waypoint x=\"540\" y=\"234\" />\n        <di:waypoint x=\"540\" y=\"300\" />\n        <di:waypoint x=\"630\" y=\"300\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"552\" y=\"274\" width=\"56\" height=\"14\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_0xtz5ns_di\" bpmnElement=\"Flow_0xtz5ns\">\n        <di:waypoint x=\"730\" y=\"209\" />\n        <di:waypoint x=\"745\" y=\"209\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_10ggdpx_di\" bpmnElement=\"Flow_10ggdpx\">\n        <di:waypoint x=\"795\" y=\"209\" />\n        <di:waypoint x=\"1005\" y=\"209\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"892\" y=\"191\" width=\"19\" height=\"14\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_02uc4va_di\" bpmnElement=\"Flow_02uc4va\">\n        <di:waypoint x=\"730\" y=\"300\" />\n        <di:waypoint x=\"1030\" y=\"300\" />\n        <di:waypoint x=\"1030\" y=\"234\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_1iyh4gc_di\" bpmnElement=\"Flow_1iyh4gc\">\n        <di:waypoint x=\"1055\" y=\"209\" />\n        <di:waypoint x=\"1077\" y=\"209\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_13lfwjz_di\" bpmnElement=\"Flow_13lfwjz\">\n        <di:waypoint x=\"1127\" y=\"209\" />\n        <di:waypoint x=\"1164\" y=\"209\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"1139\" y=\"191\" width=\"13\" height=\"14\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_033an5l_di\" bpmnElement=\"Flow_033an5l\">\n        <di:waypoint x=\"1102\" y=\"234\" />\n        <di:waypoint x=\"1102\" y=\"320\" />\n        <di:waypoint x=\"1132\" y=\"320\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"1109\" y=\"274\" width=\"19\" height=\"14\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_07nnggp_di\" bpmnElement=\"Flow_07nnggp\">\n        <di:waypoint x=\"1232\" y=\"320\" />\n        <di:waypoint x=\"1264\" y=\"320\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_1st2x5y_di\" bpmnElement=\"Flow_1st2x5y\">\n        <di:waypoint x=\"770\" y=\"184\" />\n        <di:waypoint x=\"770\" y=\"120\" />\n        <di:waypoint x=\"790\" y=\"120\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"753\" y=\"149\" width=\"13\" height=\"14\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_18wmyat_di\" bpmnElement=\"Flow_18wmyat\">\n        <di:waypoint x=\"890\" y=\"120\" />\n        <di:waypoint x=\"910\" y=\"120\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_0w9ek07_di\" bpmnElement=\"Flow_0w9ek07\">\n        <di:waypoint x=\"1010\" y=\"120\" />\n        <di:waypoint x=\"1030\" y=\"120\" />\n        <di:waypoint x=\"1030\" y=\"184\" />\n      </bpmndi:BPMNEdge>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn:definitions>",
            "name": "logistics_model_no_drivers.bpmn",
            "modelParameter": {
                "activities": [
                    {
                        "id": "Activity_0e1w0fd",
                        "resources": [],
                        "costDrivers": [
                            "Packaging Material",
                            "Filling Material"
                        ],
                        "cost": 0,
                        "duration": {
                            "distributionType": null,
                            "values": [],
                            "timeUnit": "mins"
                        }
                    }
                ],
                "events": [],
                "gateways": []
            }
        }
    ]
};

var {globalConfig, simConfigs} = await convertScenario(logisticsScenario);
console.log(globalConfig);
console.log(simConfigs[0]);

