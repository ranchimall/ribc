/*jshint esversion: 8 */
/**
 * @yaireo/relative-time - javascript function to transform timestamp or date to local relative-time
 *
 * @version v1.0.0
 * @homepage https://github.com/yairEO/relative-time
 */

!function (e, t) { var o = o || {}; "function" == typeof o && o.amd ? o([], t) : "object" == typeof exports && "object" == typeof module ? module.exports = t() : "object" == typeof exports ? exports.RelativeTime = t() : e.RelativeTime = t() }(this, (function () { const e = { year: 31536e6, month: 2628e6, day: 864e5, hour: 36e5, minute: 6e4, second: 1e3 }, t = "en", o = { numeric: "auto" }; function n(e) { e = { locale: (e = e || {}).locale || t, options: { ...o, ...e.options } }, this.rtf = new Intl.RelativeTimeFormat(e.locale, e.options) } return n.prototype = { from(t, o) { const n = t - (o || new Date); for (let t in e) if (Math.abs(n) > e[t] || "second" == t) return this.rtf.format(Math.round(n / e[t]), t) } }, n }));

const relativeTime = new RelativeTime({ style: 'narrow' });
// Global variables
const { html, render: renderElem } = uhtml;
const domRefs = {}
//Checks for internet connection status
if (!navigator.onLine)
    notify('There seems to be a problem connecting to the internet, Please check you internet connection.', 'error', '', true)
window.addEventListener('offline', () => {
    notify('There seems to be a problem connecting to the internet, Please check you internet connection.', 'error', true, true)
})
window.addEventListener('online', () => {
    getRef('notification_drawer').clearAll()
    notify('We are back online.', 'success')
})
// Use instead of document.getElementById
function getRef(elementId) {
    if (!domRefs.hasOwnProperty(elementId)) {
        domRefs[elementId] = {
            count: 1,
            ref: null,
        };
        return document.getElementById(elementId);
    } else {
        if (domRefs[elementId].count < 3) {
            domRefs[elementId].count = domRefs[elementId].count + 1;
            return document.getElementById(elementId);
        } else {
            if (!domRefs[elementId].ref)
                domRefs[elementId].ref = document.getElementById(elementId);
            return domRefs[elementId].ref;
        }
    }
}

// returns dom with specified element
function createElement(tagName, options = {}) {
    const { className, textContent, innerHTML, attributes = {} } = options
    const elem = document.createElement(tagName)
    for (let attribute in attributes) {
        elem.setAttribute(attribute, attributes[attribute])
    }
    if (className)
        elem.className = className
    if (textContent)
        elem.textContent = textContent
    if (innerHTML)
        elem.innerHTML = innerHTML
    return elem
}

// Use when a function needs to be executed after user finishes changes
const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
}

let zIndex = 50
// function required for popups or modals to appear
function openPopup(popupId, pinned) {
    zIndex++
    getRef(popupId).setAttribute('style', `z-index: ${zIndex}`)
    getRef(popupId).show({ pinned })
    return getRef(popupId);
}

// hides the popup or modal
function closePopup() {
    if (popupStack.peek() === undefined)
        return;
    popupStack.peek().popup.hide()
}


// displays a popup for asking permission. Use this instead of JS confirm
const getConfirmation = (title, options = {}) => {
    return new Promise(resolve => {
        const { message = '', cancelText = 'Cancel', confirmText = 'OK' } = options
        openPopup('confirmation_popup', true)
        getRef('confirm_title').innerText = title;
        getRef('confirm_message').innerText = message;
        const cancelButton = getRef('confirmation_popup').querySelector('.cancel-button');
        const confirmButton = getRef('confirmation_popup').querySelector('.confirm-button')
        confirmButton.textContent = confirmText
        cancelButton.textContent = cancelText
        confirmButton.onclick = () => {
            closePopup()
            resolve(true);
        }
        cancelButton.onclick = () => {
            closePopup()
            resolve(false);
        }
    })
}

//Function for displaying toast notifications. pass in error for mode param if you want to show an error.
function notify(message, mode, options = {}) {
    let icon
    switch (mode) {
        case 'success':
            icon = `<svg class="icon icon--success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"/></svg>`
            break;
        case 'error':
            icon = `<svg class="icon icon--error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/></svg>`
            options.pinned = true
            break;
    }
    if (mode === 'error') {
        console.error(message)
    }
    return getRef("notification_drawer").push(message, { icon, ...options });
}

// detect browser version
function detectBrowser() {
    let ua = navigator.userAgent,
        tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
}
window.addEventListener('hashchange', e => routeTo(window.location.hash))
window.addEventListener("load", () => {
    const [browserName, browserVersion] = detectBrowser().split(' ');
    const supportedVersions = {
        Chrome: 85,
        Firefox: 75,
        Safari: 13,
    }
    if (browserName in supportedVersions) {
        if (parseInt(browserVersion) < supportedVersions[browserName]) {
            notify(`${browserName} ${browserVersion} is not fully supported, some features may not work properly. Please update to ${supportedVersions[browserName]} or higher.`, 'error')
        }
    } else {
        notify('Browser is not fully compatible, some features may not work. for best experience please use Chrome, Edge, Firefox or Safari', 'error')
    }
    document.body.classList.remove('hidden')
    DOMPurify.setConfig = {
        FORBID_ATTR: ['style'],
        FORBID_TAGS: ['style']

    }
    DOMPurify.addHook('afterSanitizeAttributes', function (node) {
        // set all elements owning target to target=_blank
        if ('target' in node) {
            node.setAttribute('target', '_blank');
        }
        // set non-HTML/MathML links to xlink:show=new
        if (
            !node.hasAttribute('target') &&
            (node.hasAttribute('xlink:href') || node.hasAttribute('href'))
        ) {
            node.setAttribute('xlink:show', 'new');
        }
    });
    document.querySelectorAll('sm-input[data-flo-id]').forEach(input => input.customValidation = floCrypto.validateAddr)
    document.querySelectorAll('sm-input[data-private-key]').forEach(input => input.customValidation = floCrypto.getPubKeyHex)
    document.addEventListener('keyup', (e) => {
        if (e.code === 'Escape') {
            closePopup()
        }
    })
    document.addEventListener("pointerdown", (e) => {
        if (e.target.closest("button:not([disabled]), .interact")) {
            createRipple(e, e.target.closest("button, .interact"));
        }
    });
    document.addEventListener('copy', () => {
        notify('copied', 'success')
    })
});

function createRipple(event, target) {
    const circle = document.createElement("span");
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;
    const targetDimensions = target.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (targetDimensions.left + radius)}px`;
    circle.style.top = `${event.clientY - (targetDimensions.top + radius)}px`;
    circle.classList.add("ripple");
    const rippleAnimation = circle.animate(
        [
            {
                transform: "scale(4)",
                opacity: 0,
            },
        ],
        {
            duration: floGlobals.prefersReducedMotion ? 0 : 600,
            fill: "forwards",
            easing: "ease-out",
        }
    );
    target.append(circle);
    rippleAnimation.onfinish = () => {
        circle.remove();
    };
}

function getFormattedTime(timestamp, format) {
    try {
        timestamp = parseInt(timestamp)
        if (String(timestamp).length < 13)
            timestamp *= 1000
        let [day, month, date, year] = new Date(timestamp).toString().split(' '),
            minutes = new Date(timestamp).getMinutes(),
            hours = new Date(timestamp).getHours(),
            currentTime = new Date().toString().split(' ')

        minutes = minutes < 10 ? `0${minutes}` : minutes
        let finalHours = ``;
        if (hours > 12)
            finalHours = `${hours - 12}:${minutes}`
        else if (hours === 0)
            finalHours = `12:${minutes}`
        else
            finalHours = `${hours}:${minutes}`

        finalHours = hours >= 12 ? `${finalHours} PM` : `${finalHours} AM`
        switch (format) {
            case 'date-only':
                return `${month} ${date}, ${year}`;
                break;
            case 'time-only':
                return finalHours;
            case 'relative':
                return relativeTime.from(timestamp)
            default:
                return `${month} ${date}, ${year} at ${finalHours}`;
        }
    } catch (e) {
        console.error(e);
        return timestamp;
    }
}

const appState = {
    params: {},
}
const generalPages = ['sign_up', 'sign_in', 'loading', 'landing']
function routeTo(targetPage, options = {}) {
    const { firstLoad } = options
    const routingAnimation = { in: slideInUp, out: slideOutUp }
    let pageId
    let subPageId1
    let searchParams
    let params
    if (targetPage === '') {
        try {
            if (floDapps.user.id)
                pageId = 'dashboard_page'
        } catch (e) {
            pageId = 'landing'
        }
    } else {
        if (targetPage.includes('/')) {
            if (targetPage.includes('?')) {
                const splitAddress = targetPage.split('?')
                searchParams = splitAddress.pop();
                [, pageId, subPageId1] = splitAddress.pop().split('/')
            } else {
                [, pageId, subPageId1] = targetPage.split('/')
            }
        } else {
            pageId = targetPage
        }
    }

    if (!document.querySelector(`#${pageId}`)?.classList.contains('inner-page')) return
    try {
        if (floDapps.user.id && (['sign_up', 'sign_in', 'loading', 'landing'].includes(pageId))) {
            history.replaceState(null, null, '#/dashboard_page');
            pageId = 'dashboard_page'
        }
    } catch (e) {
        if (!(generalPages.includes(pageId))) return
    }
    appState.currentPage = pageId

    if (searchParams) {
        const urlSearchParams = new URLSearchParams('?' + searchParams);
        params = Object.fromEntries(urlSearchParams.entries());
    }
    if (params)
        appState.params = params
    if (firstLoad && floGlobals.tempUserTaskRequest && RIBC.getAllTasks()[floGlobals.tempUserTaskRequest]) {
        requestForTask()
    }
    switch (pageId) {
        case 'landing':
            if (!params) {
                params = { category: 'all' }
            }
            renderElem(getRef('landing_tasks_wrapper'), render.displayTasks(params.category, params.search))
            if (subPageId1) {
                showTaskDetails(params.id)
            } else {
                hideTaskDetails()
            }
            break;
        case 'sign_up':
            const { floID, privKey } = floCrypto.generateNewID()
            getRef('generated_flo_address').value = floID
            getRef('generated_private_key').value = privKey
            break;
        case 'dashboard_page':
            let renderedAssignedTasks
            if (typeOfUser === 'intern') {
                // Render assigned task cards
                if (floGlobals.assignedTasks.size) {
                    renderedAssignedTasks = filterMap(floGlobals.assignedTasks, id => render.internTaskCard(id))
                } else {
                    renderedAssignedTasks = html`No task assigned yet.`;
                }
            }
            renderElem(getRef('dashboard_page'), html`
                <strip-select id="dashboard_view_selector" class="margin-right-auto" onchange=${handleDashboardViewChange}>
                    ${typeOfUser === 'intern' ? html`<strip-option value="intern_view" selected>My tasks</strip-option>` : ''}
                    <strip-option value="dashboard_tasks_wrapper" ?selected=${typeOfUser !== 'intern'}>All tasks</strip-option>
                    <strip-option value="projects_wrapper">Projects</strip-option>
                ${floGlobals.isMobileView ? html`<strip-option value="best_interns_container">Leaderboard</strip-option>` : ''} 
                </strip-select>
                ${typeOfUser === 'intern' ? html`
                    <section id="intern_view" class="intern-option dashboard-view__item">
                        <ul id="assigned_task_list">${renderedAssignedTasks}</ul>
                    </section>
                ` : ''}
                <div id="dashboard_tasks_wrapper" class=${`flex flex-direction-column gap-1 justify-center dashboard-view__item ${typeOfUser === 'intern' ? 'hidden' : ''}`}>${render.displayTasks('all', params?.search)}</div>
                <div id="projects_wrapper" class="grid gap-2 align-items-start dashboard-view__item hidden">
                    <section id="pinned_project_section" class="w-100">
                        <h4>Pinned</h4>
                        <div id="pinned_projects" class="observe-empty-state"></div>
                        <div class="empty-state">
                            <h4>There are no pinned projects</h4>
                            <p class="margin-block-0-5">
                                You can pin projects for easier monitoring by clicking on the 'pin' icon on project card.
                            </p>
                        </div>
                    </section>
                    <div id="project_list_container" class=${`hidden`}>
                        <div class="flex align-center space-between margin-bottom-0-5">
                            <h4>Projects</h4>
                            <a href="#/project_explorer" class="button open-first-project">All</a>
                        </div>
                        <div id="project_list" class="flex flex-direction-column gap-0-3"></div>
                    </div>
                </div>
                <div id="best_interns_container" class="container-card dashboard-view__item hide-on-mobile">
                    <div class="container-header">
                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"> <path fill="none" d="M0 0h24v24H0z" /> <path d="M12 7a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 3.5l-1.323 2.68-2.957.43 2.14 2.085-.505 2.946L12 17.25l2.645 1.39-.505-2.945 2.14-2.086-2.957-.43L12 10.5zm1-8.501L18 2v3l-1.363 1.138A9.935 9.935 0 0 0 13 5.049L13 2zm-2 0v3.05a9.935 9.935 0 0 0-3.636 1.088L6 5V2l5-.001z" /> </svg>
                        <h4>Leaderboard</h4>
                        <a id="all_interns_btn" href="#/all_interns_page" class="button">All</a>
                    </div>
                    <div id="top_interns" class="observe-empty-state"></div>
                    <div class="empty-state">
                        <h4>There are no interns</h4>
                    </div>
                </div>
            `)
            render.dashProjects(getRef('pinned_projects'), pinnedProjects);
            // displays recent projects
            const unpinnedProjects = RIBC.getProjectList().filter(project => !pinnedProjects.includes(project)).reverse()
            if (unpinnedProjects.length > 0) {
                getRef('project_list_container').classList.remove('hidden')
            } else {
                getRef('project_list_container').classList.add('hidden')
            }
            render.dashProjects(getRef('project_list'), unpinnedProjects)
            delegate(getRef('top_interns'), 'click', '.intern-card', e => {
                showInternInfo(e.delegateTarget.dataset.internFloId)
            })
            //creates cards for highest performing interns
            //sort interns earned points
            const highPerformingInterns = Object.keys(RIBC.getInternList()).sort((a, b) => {
                return RIBC.getInternRating(b) - RIBC.getInternRating(a)
            });
            renderElem(getRef('top_interns'), html`${highPerformingInterns.slice(0, 8).map(floId => render.internCard(floId))}`);
            if (subPageId1) {
                showTaskDetails(params.id)
            } else {
                hideTaskDetails()
            }
            break;
        case 'updates_page': {
            if (!getRef('updates_page__project_selector').children.length) {
                renderProjectSelectorOptions()
                renderInternSelectorOptions()
            }
            const { projectCode, internId, date } = params || getUpdateFilters()
            if (params) {
                setUpdateFilters({ projectCode, internId, date })
            } else if (projectCode) {
                const dateParam = date !== '' ? `&date=${date}` : ''
                history.replaceState(null, null, `#/updates_page?projectCode=${projectCode}&internId=${internId}${dateParam}`)
            }
            let matchedUpdates
            if (projectCode !== 'all') {
                matchedUpdates = getUpdatesByProject(projectCode)
            }
            if (internId !== 'all') {
                matchedUpdates = getUpdatesByIntern(internId, matchedUpdates)
            }
            if (date) {
                matchedUpdates = getUpdatesByDate(date, matchedUpdates)
            }
            renderInternUpdates(matchedUpdates)
        } break;
        case 'applications':
            render.taskApplications()
            if (subPageId1) {
                showTaskDetails(params.id)
            } else {
                hideTaskDetails()
            }
            break;
        case 'all_interns_page':
            renderAllInterns()
            break;
        case 'project_explorer':
            if (subPageId1) {
                if (params) {
                    const { id: projectCode, branch } = params
                    if (appState.params.projectCode !== projectCode) {
                        showProjectInfo(projectCode)
                        const allProjects = getRef('project_explorer__left').querySelectorAll('.project-card');
                        allProjects.forEach(project => project.classList.remove('project-card--active'))
                        const targetProject = [...allProjects].find(project => project.getAttribute('href').includes(projectCode))
                        if (targetProject)
                            targetProject.classList.add('project-card--active')
                    }
                    if (branch) {
                        renderBranchTasks()
                    }
                    getRef('project_explorer__left').classList.add('hide-on-mobile')
                    getRef('project_explorer__right').classList.remove('hide-on-mobile')
                } else {
                    getRef('project_explorer__left').querySelectorAll('.project-card').forEach(project => project.classList.remove('project-card--active'))
                }
            } else {
                getRef('project_explorer__left').classList.remove('hide-on-mobile')
                getRef('project_explorer__right').classList.add('hide-on-mobile')
                history.replaceState(null, '', '#/project_explorer')
            }
            break;
        case 'admin_page':
            if (subPageId1) {
                if (params && RIBC.getProjectList().includes(params.id)) {
                    const { id: projectCode, branch } = params
                    renderAdminProjectView(projectCode)
                    if (branch) {
                        renderBranchTasks()
                    }
                    getRef('projects_container__left').classList.add('hide-on-mobile')
                    getRef('project_editing_panel').classList.remove('hidden')
                }
            } else {
                getRef('projects_container__left').classList.remove('hide-on-mobile')
                getRef('project_editing_panel').classList.add('hidden')
                history.replaceState(null, '', '#/admin_page')
            }
            break;
    }
    switch (appState.lastPage) {
        case 'project_explorer':
        case 'all_interns_page':
            routingAnimation.in = slideInRight;
            routingAnimation.out = slideOutRight;
            break;
    }
    switch (pageId) {
        case 'project_explorer':
        case 'all_interns_page':
            routingAnimation.in = slideInLeft;
            routingAnimation.out = slideOutLeft;
            break;
    }
    if (appState.lastPage !== pageId) {
        if (document.querySelector('.nav-list__item--active'))
            document.querySelector('.nav-list__item--active').classList.remove('nav-list__item--active');
        const targetListItem = [...document.querySelectorAll(`a.nav-list__item`)].find(item => item.href.includes(pageId))
        if (targetListItem)
            targetListItem.classList.add('nav-list__item--active')
        document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'))
        getRef(pageId).closest('.page').classList.remove('hidden')
        let ogOverflow = getRef(pageId).parentNode.style.overflow
        getRef(pageId).parentNode.style.overflow = 'hidden';
        if (appState.lastPage) {
            getRef(appState.lastPage).animate(routingAnimation.out, { duration: floGlobals.prefersReducedMotion ? 0 : 300, fill: 'forwards', easing: 'ease' }).onfinish = (e) => {
                e.target.effect.target.classList.add('hidden')
            }
        }
        getRef(pageId).classList.remove('hidden')
        getRef(pageId).animate(routingAnimation.in, { duration: floGlobals.prefersReducedMotion ? 0 : 300, fill: 'forwards', easing: 'ease' }).onfinish = (e) => {
            getRef(pageId).parentNode.style.overflow = ogOverflow;
            switch (pageId) {
                case 'sign_in':
                    getRef('private_key_field').focusIn()
                    break;
            }
        }
        appState.lastPage = pageId
    }
}
// class based lazy loading
class LazyLoader {
    constructor(container, elementsToRender, renderFn, options = {}) {
        const { batchSize = 10, freshRender, bottomFirst = false, domUpdated } = options

        this.elementsToRender = elementsToRender
        this.arrayOfElements = (typeof elementsToRender === 'function') ? this.elementsToRender() : elementsToRender || []
        this.renderFn = renderFn
        this.intersectionObserver

        this.batchSize = batchSize
        this.freshRender = freshRender
        this.domUpdated = domUpdated
        this.bottomFirst = bottomFirst

        this.shouldLazyLoad = false
        this.lastScrollTop = 0
        this.lastScrollHeight = 0

        this.lazyContainer = document.querySelector(container)

        this.update = this.update.bind(this)
        this.render = this.render.bind(this)
        this.init = this.init.bind(this)
        this.clear = this.clear.bind(this)
    }
    get elements() {
        return this.arrayOfElements
    }
    init() {
        this.intersectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    observer.disconnect()
                    this.render({ lazyLoad: true })
                }
            })
        })
        this.mutationObserver = new MutationObserver(mutationList => {
            mutationList.forEach(mutation => {
                if (mutation.type === 'childList') {
                    if (mutation.addedNodes.length) {
                        if (this.bottomFirst) {
                            if (this.lazyContainer.firstElementChild)
                                this.intersectionObserver.observe(this.lazyContainer.firstElementChild)
                        } else {
                            if (this.lazyContainer.lastElementChild)
                                this.intersectionObserver.observe(this.lazyContainer.lastElementChild)
                        }
                    }
                }
            })
        })
        this.mutationObserver.observe(this.lazyContainer, {
            childList: true,
        })
        this.render()
    }
    update(elementsToRender) {
        this.arrayOfElements = (typeof elementsToRender === 'function') ? this.elementsToRender() : elementsToRender || []
    }
    render(options = {}) {
        let { lazyLoad = false } = options
        this.shouldLazyLoad = lazyLoad
        const frag = document.createDocumentFragment();
        if (lazyLoad) {
            if (this.bottomFirst) {
                this.updateEndIndex = this.updateStartIndex
                this.updateStartIndex = this.updateEndIndex - this.batchSize
            } else {
                this.updateStartIndex = this.updateEndIndex
                this.updateEndIndex = this.updateEndIndex + this.batchSize
            }
        } else {
            this.intersectionObserver.disconnect()
            if (this.bottomFirst) {
                this.updateEndIndex = this.arrayOfElements.length
                this.updateStartIndex = this.updateEndIndex - this.batchSize - 1
            } else {
                this.updateStartIndex = 0
                this.updateEndIndex = this.batchSize
            }
            this.lazyContainer.innerHTML = ``;
        }
        this.lastScrollHeight = this.lazyContainer.scrollHeight
        this.lastScrollTop = this.lazyContainer.scrollTop
        this.arrayOfElements.slice(this.updateStartIndex, this.updateEndIndex).forEach((element, index) => {
            frag.append(this.renderFn(element))
        })
        if (this.bottomFirst) {
            this.lazyContainer.prepend(frag)
            // scroll anchoring for reverse scrolling
            this.lastScrollTop += this.lazyContainer.scrollHeight - this.lastScrollHeight
            this.lazyContainer.scrollTo({ top: this.lastScrollTop })
            this.lastScrollHeight = this.lazyContainer.scrollHeight
        } else {
            this.lazyContainer.append(frag)
        }
        if (!lazyLoad && this.bottomFirst) {
            this.lazyContainer.scrollTop = this.lazyContainer.scrollHeight
        }
        // Callback to be called if elements are updated or rendered for first time
        if (!lazyLoad && this.freshRender)
            this.freshRender()
    }
    clear() {
        this.intersectionObserver.disconnect()
        this.mutationObserver.disconnect()
        this.lazyContainer.innerHTML = ``;
    }
    reset() {
        this.arrayOfElements = (typeof this.elementsToRender === 'function') ? this.elementsToRender() : this.elementsToRender || []
        this.render()
    }
}
function buttonLoader(id, show) {
    const button = typeof id === 'string' ? getRef(id) : id;
    button.disabled = show;
    const animOptions = {
        duration: floGlobals.prefersReducedMotion ? 0 : 200,
        fill: 'forwards',
        easing: 'ease'
    }
    if (show) {
        button.animate([
            {
                clipPath: 'circle(100%)',
            },
            {
                clipPath: 'circle(0)',
            },
        ], animOptions).onfinish = e => {
            e.target.commitStyles()
            e.target.cancel()
        }
        button.parentNode.append(createElement('sm-spinner'))
    } else {
        button.style = ''
        const potentialTarget = button.parentNode.querySelector('sm-spinner')
        if (potentialTarget) potentialTarget.remove();
    }
}
// implement event delegation
function delegate(el, event, selector, fn) {
    el.addEventListener(event, function (e) {
        const potentialTarget = e.target.closest(selector)
        if (potentialTarget) {
            e.delegateTarget = potentialTarget
            fn.call(this, e)
        }
    })
}
const slideInLeft = [
    {
        opacity: 0,
        transform: 'translateX(1rem)'
    },
    {
        opacity: 1,
        transform: 'translateX(0)'
    }
]
const slideOutLeft = [
    {
        opacity: 1,
        transform: 'translateX(0)'
    },
    {
        opacity: 0,
        transform: 'translateX(-1rem)'
    },
]
const slideInRight = [
    {
        opacity: 0,
        transform: 'translateX(-1rem)'
    },
    {
        opacity: 1,
        transform: 'translateX(0)'
    }
]
const slideOutRight = [
    {
        opacity: 1,
        transform: 'translateX(0)'
    },
    {
        opacity: 0,
        transform: 'translateX(1rem)'
    },
]
const slideInDown = [
    {
        opacity: 0,
        transform: 'translateY(-1rem)'
    },
    {
        opacity: 1,
        transform: 'translateY(0)'
    },
]
const slideOutDown = [
    {
        opacity: 1,
        transform: 'translateY(0)'
    },
    {
        opacity: 0,
        transform: 'translateY(1rem)'
    },
]
const slideInUp = [
    {
        opacity: 0,
        transform: 'translateY(1rem)'
    },
    {
        opacity: 1,
        transform: 'translateY(0)'
    },
]
const slideOutUp = [
    {
        opacity: 1,
        transform: 'translateY(0)'
    },
    {
        opacity: 0,
        transform: 'translateY(-1rem)'
    },
]

function showChildElement(id, index, options = {}) {
    return new Promise((resolve) => {
        const { mobileView = false, entry, exit } = options
        const animOptions = {
            duration: floGlobals.prefersReducedMotion ? 0 : 150,
            easing: 'ease',
            fill: 'forwards'
        }
        const parent = typeof id === 'string' ? document.getElementById(id) : id;
        const visibleElement = [...parent.children].find(elem => !elem.classList.contains(mobileView ? 'hide-on-mobile' : 'hidden'));
        if (visibleElement === parent.children[index]) return;
        visibleElement.getAnimations().forEach(anim => anim.cancel())
        parent.children[index].getAnimations().forEach(anim => anim.cancel())
        if (visibleElement) {
            if (exit) {
                parent.style.overflow = 'hidden'
                visibleElement.animate(exit, animOptions).onfinish = () => {
                    visibleElement.classList.add(mobileView ? 'hide-on-mobile' : 'hidden')
                    parent.style.overflow = ''
                }
                parent.children[index].classList.remove(mobileView ? 'hide-on-mobile' : 'hidden')
                if (entry)
                    parent.children[index].animate(entry, animOptions).onfinish = () => resolve()
            } else {
                visibleElement.classList.add(mobileView ? 'hide-on-mobile' : 'hidden')
                parent.children[index].classList.remove(mobileView ? 'hide-on-mobile' : 'hidden')
                resolve()
            }
        } else {
            parent.children[index].classList.remove(mobileView ? 'hide-on-mobile' : 'hidden')
            parent.children[index].animate(entry, animOptions).onfinish = () => resolve()
        }
    })
}
function togglePrivateKeyVisibility(input) {
    const target = input.closest('sm-input')
    target.type = target.type === 'password' ? 'text' : 'password';
    target.focusIn()
}
function filterMap(array, mapFn) {
    const result = [];
    array.forEach((element, index) => {
        const mapped = mapFn(element, index)
        if (mapped) result.push(mapped)
    })
    return result;
}
const mobileQuery = window.matchMedia('(max-width: 40rem)')
function handleMobileChange(e) {
    floGlobals.isMobileView = e.matches
}
mobileQuery.addEventListener('change', handleMobileChange)
handleMobileChange(mobileQuery)
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
reduceMotionQuery.addEventListener('change', () => {
    floGlobals.prefersReducedMotion = reduceMotionQuery.matches
});
floGlobals.prefersReducedMotion = reduceMotionQuery.matches