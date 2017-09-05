const handlers = {
  showQuestionLayer
};

function htmlEncode(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function resolveUrl(rootUrl, url) {
  return `${rootUrl}${url}`;
}

function createHtml(config, rootUrl) {
  return `
    <div class="haka-root">
      <video class="haka-video" src="${resolveUrl(rootUrl, config.video)}" controls></video>
      <div class="haka-sidebar"></div>
    </div>
  `;
}

function renderProject(container, config, rootUrl) {
  const markers = config.markers;
  container.innerHTML = createHtml(config, rootUrl);
  const video = container.querySelector('.haka-video');

  video.addEventListener('timeupdate', () => {
    const index = markers.findIndex(marker => video.currentTime >= marker.timecode);
    if (index !== -1) {
      const currentMarker = markers[index];
      markers.splice(index, 1);
      handlers[currentMarker.handler](container, currentMarker.params);
    }
  }, false);

  video.play();
}

function startHaka(container, configUrl, rootUrl) {
  $.ajax({
    method: "GET",
    url: configUrl
  })
  .then(result => renderProject(container, result, rootUrl))
  .catch(error => alert(error));
}

function showQuestionLayer(container, params) {
  const markerHtml = `
    <div>
      <p>${htmlEncode(params.question)}</p>
      ${params.answers.map(answer => `<button>${htmlEncode(answer.value)}</button>`).join('')}
    </div>
  `;
  container.querySelector('.haka-sidebar').insertAdjacentHTML('beforeend', markerHtml);
}

$(() => startHaka(document.getElementById('main'), 'example/example.json', 'example/'));
