function flashMessage(flash) {
  if (flash.success && flash.success.length > 0) {
    new Noty({
      theme: "relax",
      text: flash.success,
      type: "success",
      layout: "topRight",
      timeout: 1500,
    }).show();
  } else if (flash.error && flash.error.length > 0) {
    new Noty({
      theme: "relax",
      text: flash.error,
      type: "error",
      layout: "topRight",
      timeout: 1500,
    }).show();
  }
}

$("form[action='/uploadfile']").submit((e) => {
  e.preventDefault();
  let target = $("form[action='/uploadfile']");
  let formData = new FormData(target[0]);
  $.ajax({
    type: target.attr("method"),
    url: target.attr("action"),
    data: formData,
    processData: false,
    contentType: false,
    success: function (data) {
      flashMessage(data);
      if (data.filename) {
        $("#csv-files-list").append(
          `<p id="${data._id}" onclick="getFileData('${data._id}')" >${data.filename}</p>`
        );
      }
      $("input[type='file']").val("");
    },
    error: function (err) {
      flashMessage({ error: "Error.." });
      console.log(err);
    },
  });
});

function getFileData(id) {
  if ($(".active").attr("id") != id) {
    $.ajax({
      type: "post",
      url: "/getFileData",
      data: {
        id,
      },
      success: function (data) {
        console.log(data);
        $(".active").removeClass("active");
        $(`#${id}`).addClass("active");
        $("#search-field").css("display", "block");
        $("input[type='text']").attr("placeholder", "Search");
        $("#empty-message").css("display", "none");
        $("#headings").html(tableHeader(data.headings));
        $("#table-body").html(tableRows(data.tabledata));
        $("#table-heading").text($(".active").text());
      },
      error: function (err) {
        flashMessage({ error: "Error.." });
        console.log(err);
      },
    });
  }
}

function tableHeader(headings) {
  return `<tr>
      ${headings.map((col, idx) => {
        return `<th> <small onclick="sortTable(${idx})">^</small> ${col}</th>`;
      })}
      </tr>`;
}

function tableRows(data) {
  const html = `
       ${data.map(
         (row) =>
           `<tr>
             ${Object.values(row).map((val) => `<td>${val}</td>`)}          
            </tr>`
       )}`;
  debugger;
  return html;
}

function searchFunction() {
  // Declare variables
  let input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

$("#csv-files-list p:first-child").addClass("active");
$("#table-heading").text($(".active").text());

function sortTable(n) {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      // console.log(x, y);
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
