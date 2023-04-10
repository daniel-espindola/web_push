let sw_reg;

// || Service Worker Registration:
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(function (reg) {
        sw_reg = reg;
        if (reg.installing) {
            console.log('Service worker installing');
        } else if (reg.waiting) {
            console.log('Service worker installed');
        } else if (reg.active) {
            console.log('Service worker active');
        }

    }).catch(function (error) {
        console.log('Registration failed with ' + error);
    });
}

function toggleLoading() {
    const removeIfExists = () => {
        if (document.querySelector('.loading-spinner')) {
            document.querySelector('.loading-spinner').remove();
            document.querySelector('.gray-bg').remove();
            return true
        }
        return false
    }
    if (removeIfExists() == false) {
        let loading = document.createElement('div');
        let grayBg = document.createElement('div');
        loading.innerHTML = `<i class="fas fa-spinner"></i>`;
        loading.classList.add('loading-spinner');
        grayBg.classList.add('gray-bg');
        document.body.appendChild(grayBg);
        document.body.appendChild(loading);
    }
}