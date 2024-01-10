document.addEventListener("DOMContentLoaded", function () {
  fetch("/data.csv")
    .then((response) => response.text())
    .then((data) => {
      const table = csvToTable(data);
      document.getElementById("table-container").appendChild(table);
    });
});

function csvToTable(csvString) {
  const rows = parseCSV(csvString);
  const table = document.createElement("table");

  rows.forEach((row, rowIndex) => {
    // Header row
    if (rowIndex === 0) {
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");

      for (let i = 0; i < row.length; i++) {
        const th = document.createElement("th");
        th.textContent = row[i];
        tr.appendChild(th);
      }

      thead.appendChild(tr);
      table.appendChild(thead);
      return;
    }

    const tr = document.createElement("tr");

    // print row
    console.log(row);

    // Handle Category column
    if (row.length < 3) {
      // insert empty FIRST cell for category
      const cellElement = document.createElement("td");
      cellElement.contentEditable = "true"; // Make all cells editable except the header row
      tr.appendChild(cellElement);
    }

    // Handle Title and URL columns
    for (let i = 0; i < row.length; i++) {
      const cellElement = document.createElement("td");
      cellElement.contentEditable = "true"; // Make all cells editable except the header row
      cellElement.textContent = row[i];
      tr.appendChild(cellElement);
    }

    table.appendChild(tr);
  });

  return table;
}

function parseCSV(text) {
  let rows = text.split("\n");
  return rows.map((row) => {
    let matches = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
    return matches
      ? matches.map((field) =>
          field.replace(/^"(.*)"$/, "$1").replace(/""/g, '"')
        )
      : [];
  });
}
