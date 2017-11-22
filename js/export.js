$(document).ready(() => {
  let tableNode;
  let resultTextArea;

  function seekResultTable() {
    tableNode = $('table.table_results.ajax.pma_table');

    if (!tableNode) {
      return;
    }

    const txtColor = (location.href.indexOf('/phpMyAdminProd/') > 0) ? '#CD5C5C' : '#377796';
    const colorStyle = `color:${txtColor};`;
    const actionTxt = 'Copy as markdown table';
    const copiedTxt = 'Copied ヽ(●´∀`●)ﾉ';
    const navigationNodes = $('td.navigation_goto');
    let thereIsExportButton = false;
    $.each(navigationNodes, (idx, elem) => {
      if ($('button.copyAsMarkdown', elem).length) {
        thereIsExportButton = true;
        return;
      }

      const exportButton = $(`<button class="copyAsMarkdown" data-clipboard-action="copy" data-clipboard-target="#markdownTable" style="${colorStyle}"><img class="icon ic_s_sync"> <span>${actionTxt}</span></button>`);
      $(elem).append(exportButton);
      $(exportButton).css({width: $(exportButton).outerWidth()})
      new Clipboard('button.copyAsMarkdown');
      $(exportButton).click(exportResultToMarkdownTable);
      $(exportButton).mousedown(() => {
        $('span', exportButton).html(copiedTxt);
      });
      $(exportButton).mouseup(() => {
        $('span', exportButton).html(actionTxt);
      });
      thereIsExportButton = true;
    });

    if (!thereIsExportButton) {
      const legend = $('fieldset > legend').last();
      if (legend) {
        const lastSpan = $(legend).parent().children().last();
        const lastSpanClass = $('a > span > img', lastSpan).attr('class');
        if (lastSpanClass && lastSpanClass.indexOf('ic_b_views')) {

          const exportButton = $(`<button class="copyAsMarkdown" data-clipboard-action="copy" data-clipboard-target="#markdownTable"><img class="icon ic_s_sync"> <span class="nowrap" style="${colorStyle}">${actionTxt}</span></button>`);
          $(legend[0]).parent().append(exportButton);
          $(exportButton).css({width: $(exportButton).outerWidth()})
          new Clipboard('button.copyAsMarkdown');
          $(exportButton).click(exportResultToMarkdownTable);
          $(exportButton).mousedown(() => {
            $('span', exportButton).html(copiedTxt);
          });
          $(exportButton).mouseup(() => {
            $('span', exportButton).html(actionTxt);
          });
        }
      }
    }

    if ($('textarea#markdownTable', tableNode).length === 0) {
      resultTextArea = $('<textarea id="markdownTable" style="width:1px;height:1px"></textarea>');
      $(tableNode).append(resultTextArea);
    }
  }

// style="width:1px;height:1px;"
  function exportResultToMarkdownTable () {
    const headerNodes = $('thead > tr > th.draggable', tableNode);
    const dataNodes = $('tbody > tr > td.data', tableNode);

    const headers = [];
    const rows = [];
    const maxLengths = [];
    $.each(headerNodes, (idx, elem) => {
      const header = ($(elem).text().trim());
      maxLengths.push(header.length);
      headers.push(header);
    });

    for (let i = 0; i < dataNodes.length; i += headers.length) {
        const tmp = dataNodes.slice(i, i + headers.length);
        row = [];
        $.each(tmp, (idx, elem) => {
          const value = $(elem).text().trim();
          if (value.length > maxLengths[idx]) {
            maxLengths[idx] = value.length;
          }
          row.push(value);
        })
        rows.push(row);
    }

    generatorTable(headers, rows, maxLengths);
  }

  function generatorTable(headers, rows, maxLengths) {
    let headerTxt = '';
    const resultArray = [];
    $.each(headers, (idx, header) => {
      if (idx === 0) {
        headerTxt = '|';
      }
      headerTxt += ' ' + (header + new Array(maxLengths[idx] - header.length + 1).join(' ')) + ' |';
    });
    resultArray.push(headerTxt);

    let barTxt = '';
    $.each(headers, (idx, header) => {
      if (idx === 0) {
        barTxt = '|';
      }
      barTxt += '-' + (new Array(maxLengths[idx] + 1).join('-')) + '-|';
    });
    resultArray.push(barTxt);

    $.each(rows, (idx, row) => {
      let valueTxt = '';
      $.each(row, (idx, value) => {
        if (idx === 0) {
          valueTxt = '|';
        }
        valueTxt += ' ' + (value + new Array(maxLengths[idx] - value.length + 1).join(' ')) + ' |';
      });
      resultArray.push(valueTxt);
    });

    $(resultTextArea).text(resultArray.join('\r\n'));
  }

  setInterval( () => {
    seekResultTable()
  }, 1000);
});
