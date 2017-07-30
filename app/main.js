function htmlEncode(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function resolveUrl(rootUrl, url) {
  return `${rootUrl}${url}`;
}

function createAnswerHtml(answer) {
  return `
    <button class="haka-answer">
      ${htmlEncode(answer)}
    </button>
  `
}

function createMarkerHtml(marker) {
  return `
    <div class="haka-marker" data-timecode="${marker.timecode}" data-duration="${marker.duration}">
      <p class="haka-question">${htmlEncode(marker.question)}</p>
      ${marker.answers.map(answer => createAnswerHtml(answer)).join('')}
    </div>
  `
}

function createHtml(config, rootUrl) {
  return `
    <div class="haka-root">
      <video class="haka-video" src="${resolveUrl(rootUrl, config.video)}" controls></video>
      ${config.markers.map(marker => createMarkerHtml(marker)).join('')}
    </div>
  `;
}

function renderProject(container, config, rootUrl) {
  const markers = [];
  const $container = $(container);
  $container.html(createHtml(config, rootUrl));
  $container.find('.haka-marker').each((index, marker) => {
    const $marker = $(marker);
    const timecode = Number($marker.attr('data-timecode'));
    const duration = Number($marker.attr('data-duration'));
    markers.push({
      timecode: timecode,
      duration: duration,
      $element: $marker
    });
  });
  $container.find('.haka-video').each((index, video) => {
    video.addEventListener('timeupdate', () => {
      const index = markers.findIndex(marker => video.currentTime >= marker.timecode);
      if (index !== -1) {
        const currentMarker = markers[index];
        markers.splice(index, 1);
        currentMarker.$element.addClass('haka-marker-active');
        setTimeout(() => currentMarker.$element.removeClass('haka-marker-active'), currentMarker.duration * 1000);
      }
    }, false);
    video.play();
  });

}

function startHaka(container, configUrl, rootUrl) {
  $.ajax({
    method: "GET",
    url: configUrl
  })
  .then(result => renderProject(container, result, rootUrl))
  .catch(error => alert(error));
}

$(() => startHaka('#main', 'example/example.json', 'example/'));
