let style = document.createElement('style');
document.body.appendChild(style);

function updateSepia(value) {
    style.innerText = `html { filter: sepia(${value}%) !important }`;
}

browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && 'value' in changes) {
        updateSepia(changes.value.newValue);
    }
});

browser.storage.local.get('value').then(result => updateSepia(result.value));