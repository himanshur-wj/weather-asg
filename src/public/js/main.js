let lastGeocode = null;
let lastPayload = null;

function addCard(html) {
  // dynamically add a Bootstrap card (Requirement 4)
  $('#results').prepend(
    `<div class="card mb-3 shadow-sm">
       <div class="card-body">${html}</div>
     </div>`
  );
}

$('#btnGet').on('click', async function () {
  const address = $('#address').val().trim();
  if (!address) { alert('Please enter an address'); return; }

  try {
    // 1) Geocode via our API
    const g = await $.ajax({ url: '/api/geocode', method: 'POST', contentType: 'application/json', data: JSON.stringify({ address }) });
    lastGeocode = g;

    // 2) Current + Hourly
    const current = await $.get('/api/weather/current', { lat: g.lat, lon: g.lon, units: 'metric' });
    const hourly  = await $.get('/api/weather/hourly',  { lat: g.lat, lon: g.lon, units: 'metric', hours: 12 });

    lastPayload = { address, lat: g.lat, lon: g.lon, current, hourly };

    const desc = current.weather?.[0]?.description ?? '—';
    const temp = current.main?.temp;
    const wind = current.wind?.speed;

    addCard(`
      <h5 class="mb-2">${g.place_name}</h5>
      <div>Lat/Lon: <code>${g.lat.toFixed(5)}, ${g.lon.toFixed(5)}</code></div>
      <div class="mt-2"><b>Current:</b> ${desc}, <b>${temp}°C</b>, wind ${wind} m/s</div>
      <div class="mt-2"><b>Next hours:</b> ${hourly.hourly?.length ?? (hourly.hourly_3h?.length * 3) ?? 0} data points</div>
    `);

    // Populate the plain HTML form (for non-AJAX submit)
    $('#f_address').val(address);
    $('#f_lat').val(g.lat);
    $('#f_lon').val(g.lon);
  } catch (e) {
    alert('Error: ' + (e.responseJSON?.error || e.statusText || e.message));
  }
});

$('#btnSave').on('click', async function () {
  if (!lastGeocode) { alert('Get weather first'); return; }
  try {
    const body = {
      address: $('#address').val().trim(),
      lat: lastGeocode.lat,
      lon: lastGeocode.lon,
      units: 'metric',
      hours: 12,
      method: 'fetch'
    };
    const res = await $.ajax({ url: '/api/history', method: 'POST', contentType: 'application/json', data: JSON.stringify(body) });
    addCard(`<span class="text-success">Saved! History id = ${res.id}</span>`);
  } catch (e) {
    alert('Save failed: ' + (e.responseJSON?.error || e.statusText || e.message));
  }
});

$('#btnHistory').on('click', async function () {
  try {
    const res = await $.get('/api/history', { limit: 20 });
    const rows = res.items || [];
    if (!rows.length) { $('#history').html('<em>No history yet.</em>'); return; }

    const table = [
      '<div class="table-responsive"><table class="table table-sm table-striped">',
      '<thead><tr><th>ID</th><th>Created</th><th>Address</th><th>Lat</th><th>Lon</th><th>Temp</th><th>Desc</th></tr></thead><tbody>'
    ];
    rows.forEach(r => {
      table.push(`<tr>
        <td>${r.id}</td>
        <td>${new Date(r.created_at).toLocaleString()}</td>
        <td>${r.address ?? ''}</td>
        <td>${r.lat ?? ''}</td>
        <td>${r.lon ?? ''}</td>
        <td>${r.last_temp ?? ''}</td>
        <td>${r.last_desc ? String(r.last_desc).replaceAll('"','') : ''}</td>
      </tr>`);
    });
    table.push('</tbody></table></div>');
    $('#history').html(table.join(''));
  } catch (e) {
    alert('History failed: ' + (e.responseJSON?.error || e.statusText || e.message));
  }
});
