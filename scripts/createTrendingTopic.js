
function addTrendingTopics() {
    const trendingTopicsAlreadyAdded = document.querySelector('.trending-topics');
    if (trendingTopicsAlreadyAdded) {
        return;
    }

    let suggestedUsersDiv = document.querySelector('div.r-1d5kdc7:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)');
    if(!suggestedUsersDiv) {
        suggestedUsersDiv = document.querySelector('.r-sa2ff0');  
    }

    if (!suggestedUsersDiv) {
        if(!suggestedUsersDiv) {
            console.error('Suggested Users div not found');
        }
        if(!trendingHtml) {
            console.error('Trending Topics HTML not found');
        }
        return;
    }

    // Keep all divs up to the div that contains the button and remove the subsequent ones
    let keep = true;
    Array.from(suggestedUsersDiv.children).forEach((child) => {
        if (!keep) { // Remove all subsequent divs
            suggestedUsersDiv.removeChild(child);
            return;
        }

        // Check if there is a single div with a single button inside
        const button = child.childElementCount === 1 && child.children[0].childElementCount === 1 && child.children[0].children[0].tagName === 'BUTTON';

        if (button) {
            keep = false;
        }
    });

    // Create the new div for Trending Topics
    const trendingDiv = document.createElement('div');

    function requestResource(pluginSlug, resource) {
        // Send a message to the WebView to fetch the resource
        window.ReactNativeWebView.postMessage(JSON.stringify({
            messageType: 'FETCH_RESOURCE',
            pluginSlug: pluginSlug,
            resource: resource,
        }));
    }

    window.receiveResource = function(path, content) {
        if (trendingDiv.innerHTML === content) {
            return;
        }

        trendingDiv.innerHTML = content;
        trendingDiv.classList.add('css-175oi2r');

        if (suggestedUsersDiv.parentNode) {
            if (!document.contains(trendingDiv)) {
                suggestedUsersDiv.parentNode.insertBefore(trendingDiv, suggestedUsersDiv);
            }
        }
    }

    requestResource('opensky-plugin-default', 'trending-topics.html');
}

function isRootUrl() {
    return window.location.pathname === '/search';
}

// Observe URL changes and reapply if necessary
function onUrlChange(callback) {
    let oldHref = document.location.href;

    const body = document.querySelector("body");
    const observer = new MutationObserver((mutations) => {
        if (oldHref !== document.location.href) {
            oldHref = document.location.href;
            callback();
        }
    });

    observer.observe(body, { childList: true, subtree: true });

    window.addEventListener('popstate', () => {
        callback();
    });
}

// Grants that the script will apply changes correctly after the page is fully loaded or when the DOM changes
function initTrendingTopics() {
    if (isRootUrl()) {
        if (document.readyState === 'complete') {
            addTrendingTopics();
        } else {
            document.addEventListener('DOMContentLoaded', addTrendingTopics);
            window.addEventListener('load', addTrendingTopics);
        }
    }
}

// Initialize on page load
initTrendingTopics();

// Reinitialize on URL change
onUrlChange(initTrendingTopics);
