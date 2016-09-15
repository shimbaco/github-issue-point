const MutationObserverInitOptions = {
  childList: true,
  characterData: true,
  attributes: false,
  subtree: true
};

function calcCardPoints($cards) {
  let cardPoints = _.map($cards, function(card) {
    let cardText = $(card).text();
    let estimatePointMatch = cardText.match(/\((\d+\.*\d*)\)/);
    let actualPointMatch = cardText.match(/\[(\d+\.*\d*)\]/);
    point = {
      estimate: estimatePointMatch ? Number(estimatePointMatch[1]) : 0,
      actual: actualPointMatch ? Number(actualPointMatch[1]) : 0
    };

    return point;
  });

  let estimatePoint = _.reduce(cardPoints, function(sum, point) {
    return sum + point.estimate;
  }, 0);
  let actualPoint = _.reduce(cardPoints, function(sum, point) {
    return sum + point.actual;
  }, 0);

  return {
    estimate: _.ceil(estimatePoint, 2),
    actual: _.ceil(actualPoint, 2)
  };
}

function updateColumnPoints() {
  let $columns = document.querySelectorAll(".js-project-column");

  Array.prototype.forEach.call($columns, function(column) {
    let $cards = column.querySelectorAll(".js-project-column-card");
    let point = calcCardPoints($cards);
    let $header = $(column).find(".js-details-container");

    if ($header.find(".points").length) {
      $elm = $header.find(".points");
    } else {
      $elm = $("<div>").addClass("points").appendTo($header);
    }

    $elm.text("(" + point.estimate + ") [" + point.actual + "]");
  });
}

let pointMutationObserver = new MutationObserver(_.debounce(function(mutations) {
  $.each(mutations, function(index, mutation) {
    let $target = $(mutation.target);
    // console.log('$target: ', $target);

    if (
      // カードが更新されたとき
      $target.hasClass("js-project-column-card") ||
      // カラム内が更新されたとき
      $target.hasClass("js-project-column-cards")
    ) {
      updateColumnPoints()
    }
  });
}), 500);

$(function() {
  setTimeout(function() {
    updateColumnPoints()
  }, 3000);
});

pointMutationObserver.observe(document.body, MutationObserverInitOptions);
