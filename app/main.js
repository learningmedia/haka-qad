import HakaRoot from './haka-root';

function renderProject(container, config, rootUrl) {

  const hakaApp = new HakaRoot({
    target: document.getElementById('test'),
    data: { config, rootUrl }
  });

  hakaApp.start();
}

function startHaka(container, configUrl, rootUrl) {
  $.ajax({
    method: "GET",
    url: configUrl
  })
  .then(result => renderProject(container, result, rootUrl))
  .catch(error => alert(error));
}

$(() => startHaka(document.getElementById('main'), 'example/example.json', 'example/'));
