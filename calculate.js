const fileForm = document.getElementById("fileForm")
const csvFile = document.getElementById("csvFile")
const numCategories = 3
const numAttributes = 10
const rowSize = numCategories + numAttributes + 2
const expectedThreshold = 0.5
let categories
let attributes
var li_s

fileForm.addEventListener("submit", function (e) {
    e.preventDefault()
    const input = csvFile.files[0]
    const reader = new FileReader()
    reader.onload = calculateBenchmark
    reader.readAsText(input)
    console.log(reader)
    console.log('result')
    console.log(reader.result)
})

function calculateBenchmark(e) {
    const text = e.target.result
    const rawData = parseCSV(text)
    categories = rawData.slice(1, 1 + numCategories)
    attributes = rawData.slice(2 + numCategories, rowSize)
    rows = getRows(rawData.slice(rowSize))
    expectedAttributes = findExpectedAttributes(rows)
    li_s = expectedAttributes
    update_lis(expectedAttributes)
}

function update_lis(expectedAttributes) {
    var str = ""
    for (var i = 0; i < expectedAttributes.length; i++) {
        str += "<li>" + expectedAttributes[i] + "</li>"
    }

    // get the ul by class "the_modifiable_list"
    var ul = document.getElementsByClassName("the_modifiable_list")[0]
    //insert the string into it
    ul.innerHTML = str
}

function parseCSV(text) {
    let rows = text.split("\r\n").join(",")
    return text.split("\r\n").join(",").split(",")
}

function getRows(rowsArr) {
    rows = []
    for (let i = 0; i < rowsArr.length - rowSize; i += rowSize) {
        let newRow = {}
        newRow.name = rowsArr[i]

        let newCategories = {}
        for (let j = i + 1; j < i + 1 + numCategories; j++) {
            newCategories[categories[j - 1 - i]] = rowsArr[j]
        }
        newRow.categories = newCategories

        let newAttributes = {}
        for (let j = i + 2 + numCategories; j < i + rowSize; j++) {
            newAttributes[attributes[j - i - 2- numCategories]] = rowsArr[j]
        }
        newRow.attributes = newAttributes

        rows.push(newRow)
    }
    return rows
}

function findExpectedAttributes(rows) {
    selectedCategories = {}
    for (let i = 0; i < numCategories; i++) {
        selectedCategories[categories[i]] = document.getElementById(categories[i].toLowerCase()).selectedOptions[0].value
    }
    expectedAttributes = []
    for (let i = 0; i < numAttributes; i++) {
        let categoryProportions = []
        for (let j = 0; j < numCategories; j++) {
            let yesCount = 0
            let rowWithCatogoryCount = 0
            for (let k = 0; k < rows.length; k++) {
                if (rows[k].categories[categories[j]] == selectedCategories[categories[j]]) {
                    rowWithCatogoryCount++
                    if (rows[k].attributes[attributes[i]] == "Yes") {
                        yesCount++
                    }
                }
            }
            categoryProportions.push(yesCount / rowWithCatogoryCount)
        }
        averageOfCategoryProportions = categoryProportions.reduce(function(a, b){
                return a + b;
            }) / numCategories
        if (averageOfCategoryProportions >= expectedThreshold) {
            expectedAttributes.push(attributes[i])
        }
    }
    return expectedAttributes
}