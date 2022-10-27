    floGlobals.taskCategories = {
        c00: 'Creative Writing',
        c01: 'Marketing',
        c02: 'Design',
        c03: 'Development',
        c04: 'Social Media Management',
        c05: 'Video Making',
    }
    const render = {
        displayTaskCard(projectCode, branch, task) {
            projectCode = projectCode
            const taskDetails = { title, description, category, maxSlots, duration, durationType, reward } = RIBC.getTaskDetails(projectCode, branch, task)
            return html`
            <li class=${`display-task`}>
                <div class="flex align-center space-between">
                    <a class="display-task__category" href=${`#/landing?category=${category}`} title=${`See all ${floGlobals.taskCategories[category]} tasks`}>${floGlobals.taskCategories[category]}</a>
                    <a href=${`#/${appState.currentPage}/task?id=${projectCode}_${branch}_${task}`} class="display-task__link button button--small button--colored">
                        View details
                        <svg class="icon" style="margin-right: -0.5rem" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"/></svg>
                    </a> 
                </div>
                <h4 class="display-task__title">${title}</h4>
                <div class="display-task__details flex flex-wrap gap-0-3">
                    ${duration ? html`
                        <div class="display-task__detail">
                            <span class="display-task__detail__title">Duration: </span>
                            <span class="display-task__detail__value">${duration} ${durationType}</span>
                        </div>
                    `: ''}
                    ${maxSlots ? html`
                        <div class="display-task__detail">
                            <span class="display-task__detail__title">Slots: </span>
                            <span class="display-task__detail__value">${maxSlots}</span>
                        </div>
                    `: ''}
                    ${reward ? html`
                        <div class="display-task__detail">
                            <span class="display-task__detail__title">Reward: </span>
                            <span class="display-task__detail__value" style="color: var(--green)">₹${reward}</span>
                        </div>
                    `: ''}
                </div>
            </li>
        `;
        },
        displayTasks(category, searchQuery) {
            // render tasks
            const allTasks = RIBC.getAllTasks()
            const filterCategory = category === 'all' ? false : category;
            const filtered = []
            const availableCategories = new Set();
            for (const taskId in allTasks) {
                const [projectCode, branch, task] = taskId.split('_')
                if (filterCategory && allTasks[taskId].category !== filterCategory) continue;
                if (RIBC.getTaskStatus(projectCode, branch, task) !== 'incomplete') continue;
                if (searchQuery && searchQuery !== '' && !allTasks[taskId].title.toLowerCase().includes(searchQuery.toLowerCase())) continue;
                if (RIBC.getAssignedInterns(projectCode, branch, task).length >= allTasks[taskId].maxSlots) continue;
                if (typeOfUser && typeOfUser === 'intern' && floDapps.user.id && RIBC.getAssignedInterns(projectCode, branch, task).includes(floDapps.user.id)) continue;
                filtered.push(render.displayTaskCard(projectCode, branch, task))
                availableCategories.add(allTasks[taskId].category)
            }
            let renderedTasks = filtered.reverse()
            if (searchQuery && filtered.length === 0) {
                renderedTasks = html`<p>No tasks related to <b>${searchQuery}</b></p>`
            }
            // render categories
            let renderedCategories = []
            if (availableCategories.size > 1) {
                renderedCategories = [html`<strip-option value='all' ?selected=${category === 'all'}>All</strip-option>`];
                availableCategories.forEach(categoryID => {
                    categories.push(html`<strip-option value=${categoryID} ?selected=${categoryID === category}>${floGlobals.taskCategories[categoryID]}</strip-option>`)
                })
            }
            setTimeout(() => {
                if (document.getElementById('task_search_input') && document.getElementById('task_search_input').value.trim() !== searchQuery)
                    document.getElementById('task_search_input').value = searchQuery || ''
            }, 0);
            return html`
            <div id="display_task_search_wrapper" class="flex flex-direction-column gap-1">
                <div class="flex align-center gap-1 flex-wrap space-between">
                    <h3>
                        Available Tasks
                    </h3>
                    ${(filtered.length > 0 || searchQuery) ? html`
                        <sm-input id="task_search_input" oninput="filterTasks(event)" placeholder="Search keywords" type="search">
                            <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"> <circle cx="11" cy="11" r="8"></circle> <line x1="21" y1="21" x2="16.65" y2="16.65"></line> </svg>
                        </sm-input>
                    `: ''}
                </div>
                ${availableCategories.size > 1 ? html`<strip-select id="task_category_selector" onchange='filterTasks()'>${renderedCategories}</strip-select>` : ''}
            </div>
            <div class="grid gap-1">
                <ul id="display_task_list" class="flex flex-direction-column gap-0-5 observe-empty-state">${renderedTasks}</ul>
                <div class="empty-state">
                    <p>Nothing to see here</p>
                </div>
            </div>
        `;
        },
        projectCard(projectCode, isAdmin = false, ref) {
            const projectName = RIBC.getProjectDetails(projectCode).projectName
            const page = isAdmin ? 'admin_page' : 'project_explorer'
            return html.for(ref, projectCode)`<a class="project-card flex align-center interact" title="Project information" href=${`#/${page}/project?id=${projectCode}&branch=mainLine`}>${projectName}</a>`
        },
        taskCard(task) {
            const taskDetails = { title, description, category, maxSlots, duration, durationType, reward } = RIBC.getTaskDetails(appState.params.id, appState.params.branch, task)
            const branches = getAllBranches(appState.params.id)
            const branchesButtons = filterMap(branches, (branch) => {
                const { branchName, parentBranch, startPoint, endPoint } = branch
                if (parentBranch === appState.params.branch && startPoint === task) {
                    return render.branchButton({
                        projectCode: appState.params.id,
                        branch: branchName,
                        page: 'project_explorer'
                    })
                }
            })
            const assignedInterns = RIBC.getAssignedInterns(appState.params.id, appState.params.branch, task) || []
            const assignedInternsCards = filterMap(assignedInterns, (internFloId) => render.assignedInternCard(internFloId));
            const status = RIBC.getTaskStatus(appState.params.id, appState.params.branch, task)
            let applyButton
            if (!assignedInterns.includes(myFloID) && typeOfUser !== 'admin') {
                const hasApplied = [...RIBC.getTaskRequests(false), ...sessionTaskRequests].find(({ details }) => {
                    return `${appState.params.id}_${appState.params.branch}_${task}` === details.taskId
                })
                applyButton = html`
                <button class="button button--primary apply-button" .dataset=${{ taskId: `${appState.params.id}_${appState.params.branch}_${task}` }} ?disabled=${hasApplied}>
                    ${hasApplied ? 'Applied' : 'Apply'}
                </button>`;
            }
            const linkifyDescription = createElement('p', {
                innerHTML: DOMPurify.sanitize(linkify(description)),
                className: `timeline-task__description ws-pre-line wrap-around`
            })
            return html`
            <div class=${`task ${status}`}>
                <div class="left">
                    <div class="circle">
                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
                    </div>
                    <div class="line"></div>
                </div>
                <div class="right">
                    <div class="apply-container flex space-between align-items-start">
                        <h4 class="timeline-task__title capitalize">${title}</h4>
                        ${applyButton}
                    </div>
                    ${assignedInternsCards.length ? html`<div class="assigned-interns">${assignedInternsCards}</div>` : ''}
                    <details>
                        <summary class="task-details__summary">Task details</summary>
                        ${linkifyDescription}
                    </details>
                    <div class="timeline-task__details flex flex-wrap gap-0-3">
                        ${duration ? html`
                            <div class="display-task__detail">
                                <span class="display-task__detail__title">Duration: </span>
                                <span class="display-task__detail__value">${duration} ${durationType}</span>
                            </div>
                        `: ''}
                        ${maxSlots ? html`
                            <div class="display-task__detail">
                                <span class="display-task__detail__title">Slots: </span>
                                <span class="display-task__detail__value">${maxSlots}</span>
                            </div>
                        `: ''}
                        ${reward ? html`
                            <div class="display-task__detail">
                                <span class="display-task__detail__title">Reward: </span>
                                <span class="display-task__detail__value" style="color: var(--green)">₹${reward}</span>
                            </div>
                        `: ''}
                    ${branchesButtons.length ? html`<div class="task__branch_container">${branchesButtons}</div>` : ''}
                </div>
            </div>
        `;
        },
        internCard(internFloId, { selectable = false } = {}) {
            const internName = RIBC.getInternList()[internFloId]
            const internPoints = RIBC.getInternRating(internFloId)
            const initials = internName.split(' ').map(v => v.charAt(0)).join('');
            return html`
            <label class="intern-card align-center interact" .dataset=${{ internFloId }} title="Intern Information">
                ${selectable ? html`<input type="checkbox" class="intern-card__checkbox" value=${internFloId}>` : ''}
                <div class="intern-card__initials" style=${`--color: var(${getInternColor(internFloId)})`}>${initials}</div>
                <div class="intern-card__name capitalize">${internName}</div>
                <div class="intern-card__score-wrapper flex align-center">
                    <h4 class="intern-card__score">${internPoints}</h4>
                    <svg class="icon icon--star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"> <path fill="none" d="M0 0h24v24H0z" /> <path d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z" /> </svg>
                </div>
            </label>`;
        },
        internUpdateCard(update) {
            const { floID, time, note, update: { projectCode, branch, task, description, link } } = update
            let topic = `${RIBC.getProjectDetails(projectCode).projectName} / ${RIBC.getTaskDetails(projectCode, branch, task).title}`
            const internName = RIBC.getInternList()[floID]
            let replyButton
            if (typeOfUser === 'admin' && !note) {
                replyButton = html`<button class="button button--small init-update-replay margin-left-auto">Reply</button>`
            }
            let providedLink
            if (link) {
                providedLink = html`<a href=${link} target="_blank" rel="noopener noreferrer">${link}</a> `
            }
            let adminReply
            if (note) {
                adminReply = html`<div class="admin-reply grid">
                <h4 class="admin-reply__title">Admin</h4>
                <p class="admin-reply__description ws-pre-line wrap-around">${note}</p>
            </div>`
            }
            return html.node`
            <li class="intern-update" data-vector-clock="${`${time}_${floID}`}">
                <div class="flex align-center space-between">
                    <span class="update__sender">${internName}</span>
                    <span class="update__time">${getFormattedTime(time)}</span>
                </div>
                <h4 class="update__topic">${topic}</h4>
                <p class="update__message ws-pre-line wrap-around">${description}</p>
                ${providedLink}
                ${replyButton}
                ${adminReply}
            </li>`;
        },
        branchButton(obj = {}) {
            const { projectCode, branch, page, active = false } = obj
            return html`
            <a class=${`branch-button ${active ? 'branch-button--active' : ''}`} href=${`#/${page}/project?id=${projectCode}&branch=${branch}`}>
               ${branch}
            </a>
        `;
        },
        assignedInternCard(internFloId, options) {
            let optionsButton
            if (options) {
                optionsButton = html` <button>
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/></svg>
                </button> `;
            }
            return html`
            <span class="assigned-intern" data-flo-id="${internFloId}">
                ${RIBC.getInternList()[internFloId]}
                ${optionsButton}
            </span>
        `
        },
        taskListItem(task, ref) {
            const assignedInterns = RIBC.getAssignedInterns(appState.params.id, appState.params.branch, task)
            const taskDetails = { title, description, category, maxSlots, duration, durationType, reward } = RIBC.getTaskDetails(appState.params.id, appState.params.branch, task)
            const status = RIBC.getTaskStatus(appState.params.id, appState.params.branch, task)
            let assignedInternsCards
            if (assignedInterns) {
                assignedInternsCards = filterMap(assignedInterns, (internFloId) => render.assignedInternCard(internFloId, true))
            }
            const branches = getAllBranches(appState.params.id)
            const branchesButtons = filterMap(branches, (branch) => {
                const { branchName, parentBranch, startPoint, endPoint } = branch
                if (parentBranch === appState.params.branch && startPoint === task) {
                    return render.branchButton({
                        projectCode: appState.params.id,
                        branch: branchName,
                        page: 'admin_page'
                    })
                }
            })
            const categories = [];
            for (const categoryID in floGlobals.taskCategories) {
                categories.push(html`<sm-option value=${categoryID} ?selected=${categoryID === category}>${floGlobals.taskCategories[categoryID]}</sm-option>`)
            }
            const taskDescription = createElement('p', {
                className: 'task-description ws-pre-line wrap-around',
                attributes: {
                    'data-editable': '',
                    'data-edit-field': 'description',
                },
                innerHTML: DOMPurify.sanitize(description)
            })
            return html.for(ref, `${appState.params.id}_${appState.params.branch}_${task}`)`
            <li class="task-list-item" .dataset=${{ taskId: task }}>
                <div class="flex align-center gap-0-3">
                    <div class="flex align-center gap-0-5">
                        <sm-checkbox ?checked=${status === 'completed'}>
                            <p class="margin-left-0-5">Mark as complete</p>
                        </sm-checkbox>
                        <div class="task-list-item__task-number">ID: ${task}</div>
                    </div>
                    <button class="button--danger icon-only margin-left-auto"onclick="removeThisTask()">
                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
                    </button>
                    <button class="icon-only task-option">
                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"> <path fill="none" d="M0 0h24v24H0z" /> <path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /> </svg>
                    </button>
                </div>
                <h4 class="task-title capitalize" data-editable  data-edit-field="title">${title}</h4>
                <div class="assigned-interns">
                    <button class="button--outlined button--small button--colored" onclick="currentTask=this.closest('.task-list-item');openPopup('intern_list_popup')">
                        <svg class="icon margin-right-0-3" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM5 18c.2-.63 2.57-1.68 4.96-1.94l2.04-2c-.39-.04-.68-.06-1-.06-2.67 0-8 1.34-8 4v2h9l-2-2H5zm15.6-5.5l-5.13 5.17-2.07-2.08L12 17l3.47 3.5L22 13.91z"/></svg>
                        Assign intern
                    </button>
                    ${assignedInternsCards}
                </div>
                ${taskDescription}
                <div class="grid gap-0-5 margin-top-1" style="grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));">
                    <sm-select data-edit-field="category" label="Category: ">${categories}</sm-select>
                    <div class="flex flex-1">
                        <sm-input data-edit-field="duration" value="${duration}" class="flex-1" placeholder="Duration" type="number" style="--border-radius: 0.5rem 0 0 0.5rem; border-right: thin solid rgba(var(--text-color), 0.3);" animate="" aria-label="Duration" role="textbox">
                            <svg slot="icon" class="icon" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"> <g> <rect fill="none" height="24" width="24"></rect> </g> <g> <g> <g> <path d="M15,1H9v2h6V1z M11,14h2V8h-2V14z M19.03,7.39l1.42-1.42c-0.43-0.51-0.9-0.99-1.41-1.41l-1.42,1.42 C16.07,4.74,14.12,4,12,4c-4.97,0-9,4.03-9,9s4.02,9,9,9s9-4.03,9-9C21,10.88,20.26,8.93,19.03,7.39z M12,20c-3.87,0-7-3.13-7-7 s3.13-7,7-7s7,3.13,7,7S15.87,20,12,20z"></path> </g> </g> </g> </svg>
                        </sm-input>
                        <sm-select data-edit-field="durationType" class="flex-shrink-0" style="--select-border-radius: 0 0.5rem 0.5rem 0;" role="listbox" align-select="right" value="days">
                            <sm-option value="days" ?selected=${durationType === "days"}>Days</sm-option>
                            <sm-option value="months" ?selected=${durationType === "months"}>Months</sm-option>
                        </sm-select>
                    </div>
                    <sm-input data-edit-field="maxSlots" value=${maxSlots} placeholder="Max slots available" type="number" animate="" aria-label="Max slots available" role="textbox"> </sm-input>
                    <sm-input data-edit-field="reward" value=${reward} type="number" placeholder="Reward" animate="" aria-label="Reward" role="textbox">
                        <svg slot="icon" class="icon" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"> <g> <rect fill="none" height="24" width="24"></rect> </g> <g> <g> <path d="M13.66,7C13.1,5.82,11.9,5,10.5,5L6,5V3h12v2l-3.26,0c0.48,0.58,0.84,1.26,1.05,2L18,7v2l-2.02,0c-0.25,2.8-2.61,5-5.48,5 H9.77l6.73,7h-2.77L7,14v-2h3.5c1.76,0,3.22-1.3,3.46-3L6,9V7L13.66,7z"> </path> </g> </g> </svg>
                    </sm-input>
                </div>
                ${branchesButtons.length ? html`<div class="task__branch_container">${branchesButtons}</div>` : ''}
            </li>
        `;
        },
        taskRequestCard(request) {
            const { details: { taskId, name, brief, contact, portfolioLink }, floID, vectorClock } = request
            const internName = RIBC.getInternList()[floID];
            const [projectCode, branch, task] = taskId.split('_');
            const { category } = RIBC.getTaskDetails(projectCode, branch, task);
            return html`
            <li class="request-card" .dataset=${{ vectorClock, type: 'task' }}>
                <div class="display-task__category justify-self-start">${floGlobals.taskCategories[category]}</div>
                <p class="request-card__description">
                    <b class="capitalize">${internName || name}</b> applied for 
                    <b class="capitalize">${RIBC.getTaskDetails(projectCode, branch, task).title}</b>
                </p>
                ${!internName ? html`
                    <div class="request-card__details grid gap-0-5 margin-top-1">
                        ${brief ? html`
                            <div class="grid gap-0-3">
                                <h5>Educational background</h5>
                                <p class="ws-pre-line wrap-around">${brief}</p>
                            </div>
                            ` : ''}
                        ${contact ? html`
                            <div class="grid gap-0-3">
                                <h5>Contact</h5>
                                <sm-copy value=${contact}></sm-copy>
                            </div>
                            ` : ''}
                        ${portfolioLink ? html`
                            <div class="grid gap-0-3">
                                <h5>Portfolio link</h5>
                                <a href="${portfolioLink}" target="_blank">${portfolioLink}</a>
                            </div>
                            ` : ''}
                </div>
                ` : ''}
                <div class="flex gap-0-3 margin-left-auto">
                    <button class="button button--small reject-request">
                        <svg class="icon margin-right-0-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/></svg>
                        Reject
                    </button>
                    <button class="button button--small button--primary accept-request">
                        <svg class="icon margin-right-0-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"/></svg>
                        Accept
                    </button>
                </div>
            </li>            
        `;
        },
        internTaskCard(uniqueId) {
            const [projectCode, branch, task] = uniqueId.split('_');
            const { title, description } = RIBC.getTaskDetails(projectCode, branch, task)
            const projectName = RIBC.getProjectDetails(projectCode).projectName
            const linkifyDescription = createElement('p', {
                innerHTML: DOMPurify.sanitize(linkify(description)),
                className: `timeline-task__description ws-pre-line wrap-around`
            })
            return html`
            <li class="task-card" data-unique-id="${uniqueId}">
                <span class="task__project-title">${projectName}</span>
                <div>
                    <h4 class="task__title">${title}</h4>
                    ${linkifyDescription}
                </div>
                <button class="send-update-button button--small margin-left-auto" onclick=${initTaskUpdate}>
                    <svg class="icon margin-right-0-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"/></svg>    
                    Post an update
                </button>
            </li>
        `;
        },
        dashProject(projectCode, ref) {
            const { projectName } = RIBC.getProjectDetails(projectCode)
            const projectMap = RIBC.getProjectMap(projectCode)
            const projectTasks = []
            RIBC.getProjectBranches(projectCode).forEach(branch => {
                projectMap[branch].slice(4).forEach((task) => {
                    projectTasks.push(RIBC.getTaskStatus(projectCode, branch, task))
                })
            })
            const completedTasks = projectTasks.filter(task => task === 'completed').length
            let completePercent = parseFloat(((completedTasks / (projectTasks.length || 1)) * 100).toFixed(2))
            const isPinned = pinnedProjects.includes(projectCode);
            let pinIcon = ''
            if (isPinned) {
                pinIcon = html`<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M8 6.2V4H7V2H17V4H16V12L18 14V16H17.8L14 12.2V4H10V8.2L8 6.2ZM20 20.7L18.7 22L12.8 16.1V22H11.2V16H6V14L8 12V11.3L2 5.3L3.3 4L20 20.7ZM8.8 14H10.6L9.7 13.1L8.8 14Z"/> </svg>`;
            } else {
                pinIcon = html`<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12ZM8.8 14L10 12.8V4H14V12.8L15.2 14H8.8Z"/> </svg>`;
            }
            return html.for(ref, projectCode)`
            <div class="pinned-card" data-id=${projectCode}>
                <div class="project-icon">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"> <path fill="none" d="M0 0h24v24H0z" /> <path d="M12.414 5H21a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2zM4 7v12h16V7H4z" /> </svg>
                </div>
                <div class="flex space-between align-items-start">
                    <a class="flex align-center" href=${`#/project_explorer/project?id=${projectCode}&branch=mainLine`}>
                        <h4 class="project__title">${projectName}</h4>
                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"/></svg>
                    </a>
                    <button class="icon-only pin-project" title=${`${isPinned ? 'Unpin' : 'Pin'} this project`} onclick="pinProject(this)" data-pinned=${isPinned}>${pinIcon}</button>
                </div>
                <div class="progress-bar">
                    <div class="progress-value" style=${`width: ${completePercent}%`}></div>
                </div>
                <span class="project__complete-percent">${completePercent}% complete</span>
            </div>
        `
        },
        dashProjects(where, projects) {
            renderElem(where, html`${projects.map(project => render.dashProject(project, where))} `)
        },
        internRequests() {
            const requestCategories = new Set()
            const requestProjects = new Set()
            const shouldFilterByProject = getRef('filter_requests_by_project').value !== 'all' ? getRef('filter_requests_by_project').value : false;
            const shouldFilterByCategory = getRef('filter_requests_by_category').value !== 'all' ? getRef('filter_requests_by_category').value : false;
            let requestCards = filterMap(RIBC.getTaskRequests().reverse(), (request) => {
                if (Array.isArray(request.details) || !request.details.taskId) return;
                const [projectCode, branch, task] = request.details.taskId.split('_')
                const taskDetails = RIBC.getTaskDetails(projectCode, branch, task)
                if (!taskDetails) return;
                requestCategories.add(RIBC.getTaskDetails(projectCode, branch, task).category)
                requestProjects.add(projectCode)
                if (shouldFilterByCategory && taskDetails.category !== shouldFilterByCategory) return;
                if (shouldFilterByProject && projectCode !== shouldFilterByProject) return;
                return render.taskRequestCard(request)
            })
            renderElem(getRef('requests_list'), html`${requestCards}`)
            if (requestCategories.size) {
                const categoryOptions = [...requestCategories].map(cat => html`<sm-option value=${cat}>${floGlobals.taskCategories[cat]}</sm-option>`);
                renderElem(getRef('filter_requests_by_category'), html`${[html`<sm-option value='all' selected>All</sm-option>`, ...categoryOptions]}`)
            }
            if (requestProjects.size) {
                const projectOptions = [...requestProjects].map(project => html`<sm-option value=${project}>${RIBC.getProjectDetails(project).projectName}</sm-option>`);
                renderElem(getRef('filter_requests_by_project'), html`${[html`<sm-option value='all' selected>All</sm-option>`, ...projectOptions]}`)
            }
            if (requestCategories.size || requestProjects.size) {
                getRef('requests_container__filters').classList.remove('hidden')
            } else {
                getRef('requests_container__filters').classList.add('hidden')
            }
        },
        projectList(container, projects, isAdminList = false) {
            renderElem(container, html`${projects.map(projectCode => render.projectCard(projectCode, isAdminList, container))}`)
        },
        requestStatus(request) {
            if (Array.isArray(request.details) || !request.details.taskId) return
            const { details: { taskId }, status, vectorClock } = request;
            const [projectCode, branch, task] = taskId.split('_');
            if (!RIBC.getTaskDetails(projectCode, branch, task)) return
            const timestamp = parseInt(vectorClock.split('_')[0])
            let icon = ''
            if (status === 'Accepted') {
                icon = html`<svg class="icon margin-right-0-3" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>`
            } else if (status === 'Rejected') {
                icon = html`<svg class="icon margin-right-0-3" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/></svg>`
            } else {
                icon = html`<svg class="icon margin-right-0-3" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>`
            }
            return html`
            <li class=${`status-card ${status?.toLowerCase() || 'pending'}`}>
                <time class="status-card__time capitalize">${getFormattedTime(timestamp, 'relative')}</time>
                <p class="status-card__details">
                    You applied for <a class="capitalize" href=${`#/${appState.currentPage}/task?id=${taskId}`}>${RIBC.getTaskDetails(projectCode, branch, task).title}</a>
                </p>
                <div class="flex align-center status-card__status">
                    ${icon}
                    <span>${status || 'Under review'}</span>
                </div>
            </li>
        `;
        },
        taskApplications() {
            const taskRequests = RIBC.getTaskRequests(false)
            taskRequests.sort((a, b) => {
                return parseInt(b.vectorClock.split('_')[0]) - parseInt(a.vectorClock.split('_')[0])
            })
            const taskCards = filterMap(taskRequests, request => render.requestStatus(request))
            renderElem(getRef('task_requests_list'), html`${taskCards}`)
        }
    }
    const selectedColors = [
        '--dark-red',
        '--red',
        '--kinda-pink',
        '--purple',
        '--shady-blue',
        '--nice-blue',
        '--maybe-cyan',
        '--teal',
        '--mint-green',
        '--greenish-yellow',
        '--yellowish-green',
        '--dark-teal',
        '--orange',
        '--tangerine',
        '--redish-orange',
    ]
    function randomColor() {
        return selectedColors[Math.floor(Math.random() * selectedColors.length)];
    }
    const renderedIntensColor = {}
    function getInternColor(floId) {
        if (!renderedIntensColor[floId]) {
            renderedIntensColor[floId] = randomColor()
        }
        return renderedIntensColor[floId]
    }

    const filterTasks = debounce((e) => {
        const searchQuery = getRef('task_search_input').value.trim();
        const category = getRef('task_category_selector')?.value || 'all';
        window.location.hash = `#/${appState.currentPage}?category=${category}${searchQuery !== '' ? `&search=${searchQuery}` : ''}`;
    }, 100)

    function showTaskDetails(taskId) {
        const [projectCode, branch, task] = taskId.split('_')
        const { title, description, category, maxSlots, duration, durationType, reward } = RIBC.getTaskDetails(projectCode, branch, task)
        let hasApplied = false
        try {
            floDapps.user.id
            hasApplied = [...RIBC.getTaskRequests(false), ...sessionTaskRequests].find(({ details }) => {
                return taskId === details.taskId
            })
        } catch (e) { }
        const descriptionTag = createElement('p', {
            innerHTML: DOMPurify.sanitize(linkify(description)),
            className: 'ws-pre-line wrap-around'
        })
        descriptionTag.id = 'task_description'
        renderElem(getRef('task_details_wrapper'), html`
        <div class="flex" style="position: sticky; top: 0; background-color: rgba(var(--foreground-color),1); padding: 1rem 0 0.5rem 0">
            <button class="button icon-only align-self-start" onclick="history.back()" title="Go back">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"> <path d="M0 0h24v24H0V0z" fill="none"></path> <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"> </path> </svg>
            </button>
        </div>
        <div class="grid gap-1">
            <h5 class="capitalize">${floGlobals.taskCategories[category]}</h5>
            <h2 id="task_title">${title}</h2>
            <div class="display-task__details flex flex-wrap gap-0-3">
                ${duration ? html`
                    <div class="display-task__detail">
                        <span class="display-task__detail__title">Duration: </span>
                        <span class="display-task__detail__value">${duration} ${durationType}</span>
                    </div>
                `: ''}
                ${maxSlots ? html`
                    <div class="display-task__detail">
                        <span class="display-task__detail__title">Slots: </span>
                        <span class="display-task__detail__value">${maxSlots}</span>
                    </div>
                `: ''}
                ${reward ? html`
                    <div class="display-task__detail">
                        <span class="display-task__detail__title">Reward: </span>
                        <span class="display-task__detail__value" style="color: var(--green)">₹${reward}</span>
                    </div>
                `: ''}    
            </div>
            ${descriptionTag}
        </div>
        ${!hasApplied ? html`
            <button class="button button--primary" .dataset=${{ taskId }} onclick="requestForTask(this)">Apply Now</button>
            `: ''}
    `);
        getRef('task_details').classList.remove('hidden')
        const animOptions = {
            duration: floGlobals.prefersReducedMotion ? 0 : 300,
            easing: 'ease',
            fill: 'forwards'
        }
        getRef('task_details__backdrop').animate([
            { opacity: 0 },
            { opacity: 1 }
        ], animOptions)
        getRef('task_details_wrapper').animate([
            { transform: 'translateX(100%)' },
            { transform: 'translateX(0)' }
        ], animOptions)
        if (appState.currentPage === 'landing') {
            getRef('landing').animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-10%)' }
            ], animOptions)
        }
    }
    function hideTaskDetails() {
        if (getRef('task_details').classList.contains('hidden')) return;
        history.replaceState(null, null, `#/${appState.currentPage}`);
        const animOptions = {
            duration: floGlobals.prefersReducedMotion ? 0 : 300,
            easing: 'ease',
            fill: 'forwards'
        }
        getRef('task_details__backdrop').animate([
            { opacity: 1 },
            { opacity: 0 }
        ], animOptions).onfinish = () => {
            getRef('task_details').classList.add('hidden')
            renderElem(getRef('task_details_wrapper'), html``)
        }
        getRef('task_details_wrapper').animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(100%)' }
        ], animOptions)
        if (appState.currentPage === 'landing') {
            getRef('landing').animate([
                { transform: 'translateX(-10%)' },
                { transform: 'translateX(0)' },
            ], animOptions)
        }
    }

    let pinnedProjects = [];
    let currentIntern;
    let typeOfUser = 'general';

    function handleDashboardViewChange(e) {
        document.querySelectorAll('.dashboard-view__item').forEach(item => {
            if (item.id === 'best_interns_container')
                item.classList.add('hide-on-mobile')
            else
                item.classList.add('hidden')
        })
        document.querySelector(`#${e.target.value}`).classList.remove('hide-on-mobile', 'hidden')
    }


    // Adds interns to the database **Only SubAdmins can add interns
    function addInternToList() {
        let internName = getRef('intern_name_field').value.trim(),
            internFloId = getRef('intern_flo_id_field').value.trim();
        if (RIBC.admin.addIntern(internFloId, internName)) {
            renderElem(getRef('admin_page__intern_list'), filterInterns(''))
            closePopup();
            notify(`${internName} added as an intern.`, 'success')
        }
    }
    function addProjectToList() {
        let projectName = getRef('project_name_field').value.trim(),
            projectDescription = getRef('project_description_field').value.trim();
        if (projectName === '') {
            return notify('Project name is important!', 'error')
        }
        if (projectDescription === '') {
            return notify('Project description is important!', 'error')
        }
        const projectCode = `${new Date().getFullYear()}-project-${RIBC.getProjectList() ? (RIBC.getProjectList().length + 1) : '1'}`;
        RIBC.admin.createProject(projectCode)
        RIBC.admin.addProjectDetails(projectCode, { projectName, projectDescription })
        render.projectList(getRef('admin_page__project_list'), getSortedProjectList(), true)
        getRef('admin_page__project_list').querySelector(`[href="#/admin_page/project?id=${projectCode}&branch=mainLine"]`)?.click()
        closePopup();
    }

    function makeEditable(elem) {
        floGlobals.tempEditableContent = DOMPurify.sanitize(elem.innerHTML.trim())
        elem.contentEditable = true
        elem.focus()
        document.execCommand('selectAll', false, null);
    }

    getRef('project_details_wrapper').addEventListener('dblclick', e => {
        if (e.target.closest('[data-editable]') && !e.target.closest('[data-editable]').isContentEditable) {
            makeEditable(e.target.closest('[data-editable]'))
        }
    })
    getRef('project_details_wrapper').addEventListener('focusout', (e) => {
        if (e.target.isContentEditable) {
            e.target.contentEditable = false
            if (e.target.innerHTML.trim() !== '' && floGlobals.tempEditableContent !== DOMPurify.sanitize(e.target.innerHTML.trim())) {
                const newTitle = DOMPurify.sanitize(getRef('editing_panel__title').innerHTML.trim())
                const newDescription = DOMPurify.sanitize(getRef('editing_panel__description').innerHTML.trim())
                RIBC.admin.addProjectDetails(appState.params.id, { projectName: newTitle, projectDescription: newDescription })
                notify('Changes saved locally, commit the changes to make them permanent', 'success')
                render.projectList(getRef('admin_page__project_list'), getSortedProjectList(), true)
            } else {
                e.target.innerHTML = floGlobals.tempEditableContent
            }
        }
    })

    // opens a popup containing various intern information
    function showInternInfo(internFloId) {
        const internName = RIBC.getInternList()[internFloId]
        getRef('intern_info__initials').textContent = internName.split(' ').map(v => v.charAt(0)).join('');
        getRef('intern_info__initials').style.setProperty('--color', `var(${getInternColor(internFloId)})`)
        getRef('intern_info__name').textContent = internName;
        getRef('intern_info__flo_id').value = currentIntern = internFloId;
        getRef('intern_info__score').textContent = RIBC.getInternRating(internFloId); // points earned by intern
        if (RIBC.getInternRating(internFloId) === 1) {
            getRef('reduce_score_button').disabled = true;
        }
        openPopup('intern_info_popup');
    }

    // opens a popup containing various project information
    function showProjectInfo(projectCode) {
        const { projectName, projectDescription } = RIBC.getProjectDetails(projectCode);
        getRef('project_explorer__project_title').textContent = projectName; // project name
        getRef('project_explorer__project_description').textContent = projectDescription;
        getRef('project_explorer__project_updates').href = `#/updates_page?projectCode=${projectCode}&internId=all`;
        renderBranches();
    }

    let currentTask = '';
    function renderAdminProjectView(projectCode) {
        const allProjects = getRef('admin_page__project_list').querySelectorAll('.project-card');
        allProjects.forEach(project => project.classList.remove('project-card--active'))
        const targetProject = Array.from(allProjects).find(project => project.getAttribute('href').includes(projectCode))
        if (targetProject)
            targetProject.classList.add('project-card--active')
        const { projectName, projectDescription } = RIBC.getProjectDetails(projectCode);
        getRef('editing_panel__title').textContent = projectName;
        getRef('editing_panel__description').textContent = projectDescription;
        renderBranches()
    }
    function renderBranches() {
        const { id: projectCode, branch } = appState.params
        const taskListContainer = appState.currentPage === 'admin_page' ? 'branch_container' : 'explorer_branch_container';
        const branchList = filterMap(RIBC.getProjectBranches(appState.params.id), (branch) => {
            return render.branchButton({ projectCode, branch, page: appState.currentPage, active: branch === appState.params.branch })
        })
        if (branchList.length > 1) {
            renderElem(getRef(taskListContainer), html`${branchList}`)
            getRef(taskListContainer).classList.remove('hidden')
        } else {
            getRef(taskListContainer).classList.add('hidden')
        }
    }
    function renderBranchTasks() {
        const { id: projectCode, branch } = appState.params
        const taskListContainer = appState.currentPage === 'admin_page' ? 'task_list' : 'explorer_task_list';
        let branchTasks = RIBC.getProjectMap(appState.params.id)[appState.params.branch];
        if (branchTasks[1] && !taskListContainer === 'task_list') {
            getRef(taskListContainer).textContent = "No tasks added yet, Please explore other projects"
        } else {
            let tasks = []
            if (branch !== 'mainLine') {
                const { startPoint, parentBranch } = getAllBranches(projectCode).find(({ branchName }) => branchName === branch)
                tasks.push(html`<p class="margin-bottom-0-5">
                Branched off from <a href=${`#/${appState.currentPage}/project?id=${projectCode}&branch=${parentBranch}`}> ${parentBranch} </a>    
            </p>`)
            }
            if (taskListContainer === 'task_list') {
                branchTasks.slice(4).forEach((task) => tasks.push(render.taskListItem(task, getRef(taskListContainer))))
            } else {
                branchTasks.slice(4).forEach((task) => tasks.push(render.taskCard(task)))
            }
            renderElem(getRef(taskListContainer), html`${tasks}`)
        }
    }
    function getAllBranches(projectCode) {
        const projectMap = RIBC.getProjectMap(projectCode)
        const projectBranches = RIBC.getProjectBranches(projectCode)
        return projectBranches.slice(1).map((branchName, index) => {
            const [parentBranch, , startPoint, endPoint] = projectMap[branchName]
            return {
                branchName,
                parentBranch,
                startPoint,
                endPoint
            }
        })
    }

    let currentViewIndex = 0;
    getRef('admin_view_selector').addEventListener('change', (e) => {
        const newViewIndex = parseInt(e.target.value);
        showChildElement(getRef('admin_views'), newViewIndex, { entry: newViewIndex > currentViewIndex ? slideInLeft : slideInRight, exit: newViewIndex > currentViewIndex ? slideOutLeft : slideOutRight });
        currentViewIndex = parseInt(e.target.value);
    })

    function toggleEditing(target) {
        if (target === 'title') {
            makeEditable(currentTask.querySelector('.task-title'))
        } else {
            makeEditable(currentTask.querySelector('.task-description'))
        }
    }
    function formatAmount(amount = 0, currency = 'inr') {
        if (!amount)
            return '₹0';
        return amount.toLocaleString(currency === 'inr' ? `en-IN` : 'en-US', { style: 'currency', currency, maximumFractionDigits: 0 })
    }
    delegate(getRef('task_list'), 'change', 'sm-checkbox', (e) => {
        currentTask = e.target.closest('.task-list-item');
        const taskStatus = e.target.checked ? 'completed' : 'incomplete'
        RIBC.admin.putTaskStatus(taskStatus, appState.params.id, appState.params.branch, currentTask.dataset.taskId)
    })
    delegate(getRef('task_list'), 'change', 'sm-select', (e) => {
        currentTask = e.target.closest('.task-list-item');
        const taskDetails = {
            [e.target.dataset.editField]: e.target.value
        }
        RIBC.admin.editTaskDetails(taskDetails, appState.params.id, appState.params.branch, currentTask.dataset.taskId)
        notify('Changes saved locally, commit the changes to make them permanent', 'success')
    })
    getRef('task_list').addEventListener('focusout', (e) => {
        currentTask = e.target.closest('.task-list-item');
        if (!currentTask) return;
        const ogTaskDetails = RIBC.getTaskDetails(appState.params.id, appState.params.branch, currentTask.dataset.taskId)
        const newTaskDetails = {}
        let valid = false;
        if (e.target.isContentEditable) {
            e.target.contentEditable = false
            newTaskDetails[e.target.dataset.editField] = DOMPurify.sanitize(e.target.innerHTML.trim())
            valid = true;
        } else if (e.target.closest('sm-input')) {
            newTaskDetails[e.target.dataset.editField] = parseInt(e.target.value)
            valid = true;
        }
        if (!valid) return;
        if (ogTaskDetails[e.target.dataset.editField] !== newTaskDetails[e.target.dataset.editField]) {
            RIBC.admin.editTaskDetails(newTaskDetails, appState.params.id, appState.params.branch, currentTask.dataset.taskId)
            notify('Changes saved locally, commit the changes to make them permanent', 'success')
        }
    })
    getRef('task_list').addEventListener('dblclick', (e) => {
        if (e.target.closest('[data-editable]') && !e.target.closest('[data-editable]').isContentEditable) {
            makeEditable(e.target.closest('[data-editable]'))
        }
    })
    getRef('task_list').addEventListener('click', (e) => {
        if (e.target.closest('.task-list-item')) {
            currentTask = e.target.closest('.task-list-item');
        }
        if (e.target.closest('.task-option')) {
            const optionButton = e.target.closest('.task-option')
            getRef('task_context').setAttribute('style', `top: ${optionButton.offsetTop}px`)
            getRef('task_context').classList.remove('hidden')
            getRef('task_context').animate([
                {
                    transform: 'scaleY(0.95) translateY(-0.5rem)',
                    opacity: '0'
                },
                {
                    transform: 'none',
                    opacity: '1'
                },
            ], {
                duration: floGlobals.prefersReducedMotion ? 0 : 200,
                easing: 'ease'
            })
                .onfinish = () => {
                    getRef('task_context').firstElementChild.focus()
                    const y = document.addEventListener("click", function (e) {
                        if (e.target.closest('#context_menu') || e.target.closest('.task-option')) return;
                        getRef('task_context').animate([
                            {
                                transform: 'none',
                                opacity: '1'
                            },
                            {
                                transform: 'scaleY(0.95) translateY(-0.5rem)',
                                opacity: '0'
                            },
                        ], {
                            duration: floGlobals.prefersReducedMotion ? 0 : 100,
                            easing: 'ease'
                        }).onfinish = () => {
                            getRef('task_context').classList.add('hidden')
                            document.removeEventListener('click', y);
                        }
                    });
                }
        }
        else if (e.target.closest('.assigned-intern button')) {
            getConfirmation('Do you want to unassign this intern from this task?', { confirmText: 'Unassign' }).then((result) => {
                if (result) {
                    RIBC.admin.unassignInternFromTask(e.target.closest('.assigned-intern').dataset.floId, appState.params.id, appState.params.branch, currentTask.dataset.taskId)
                    notify('Intern removed from the task')
                    renderBranchTasks()
                }
            })
        }
        else if (e.target.closest('.cancel-task-button')) {
            const card = e.target.closest('.temp-task')
            card.remove();
            getRef('add_task').classList.remove('hidden')
        }
        else if (e.target.closest('.add-task-button')) {
            const card = e.target.closest('.temp-task')
            const title = card.querySelector('.temp-task__title').value.trim();
            const description = card.querySelector('.temp-task__description').value.trim();
            const category = card.querySelector('.temp-task__category').value.trim();
            const maxSlots = parseInt(card.querySelector('.temp-task__max-slots').value.trim());
            const duration = parseInt(card.querySelector('.temp-task__duration').value.trim());
            const durationType = card.querySelector('.temp-task__duration-type').value.trim();
            const reward = parseInt(card.querySelector('.temp-task__reward').value.trim());
            if (title === '') {
                return notify('Please enter task title', 'error')
            }
            if (description === '') {
                return notify('Please enter description of the task', 'error')

            }
            const taskDetails = {
                title,
                description,
                category,
                maxSlots,
                duration,
                durationType,
                reward
            }
            const task = RIBC.admin.addTaskInMap(appState.params.id, appState.params.branch)
            RIBC.admin.editTaskDetails(taskDetails, appState.params.id, appState.params.branch, task)
            RIBC.admin.putTaskStatus('incomplete', appState.params.id, appState.params.branch, task)
            card.remove()
            renderBranchTasks()
            getRef('add_task').classList.remove('hidden')
            notify('Task added to current branch', 'success')
        }
    })
    function addPlaceholderTask() {
        const categories = [];
        let first = true;
        for (const categoryID in floGlobals.taskCategories) {
            categories.push(html`<sm-option value=${categoryID} ?selected=${first}>${floGlobals.taskCategories[categoryID]}</sm-option>`)
            first = false;
        }
        const placeholderTask = html.node`
        <div class="temp-task grid gap-0-5">
            <sm-form style="--gap: 0.5rem;">
                <sm-input class="temp-task__title" placeholder="Title" animate required></sm-input>
                <sm-textarea class="temp-task__description" placeholder="Description" rows="6" required></sm-textarea>
                <div class="grid gap-0-5" style="grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));">
                    <sm-select class="temp-task__category" label="Category: ">${categories}</sm-select>
                    <sm-input class="temp-task__max-slots flex-1" placeholder="Max slots available" type="number" animate> </sm-input>
                    <div class="flex flex-1">
                        <sm-input class="temp-task__duration flex-1" placeholder="Duration" type="number" style="--border-radius: 0.5rem 0 0 0.5rem; border-right: thin solid rgba(var(--text-color), 0.3);" animate>
                            <svg slot="icon" class="icon" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"> <g> <rect fill="none" height="24" width="24" /> </g> <g> <g> <g> <path d="M15,1H9v2h6V1z M11,14h2V8h-2V14z M19.03,7.39l1.42-1.42c-0.43-0.51-0.9-0.99-1.41-1.41l-1.42,1.42 C16.07,4.74,14.12,4,12,4c-4.97,0-9,4.03-9,9s4.02,9,9,9s9-4.03,9-9C21,10.88,20.26,8.93,19.03,7.39z M12,20c-3.87,0-7-3.13-7-7 s3.13-7,7-7s7,3.13,7,7S15.87,20,12,20z" /> </g> </g> </g> </svg>
                        </sm-input>
                        <sm-select class="temp-task__duration-type flex-shrink-0"
                            style="--select-border-radius: 0 0.5rem 0.5rem 0;">
                            <sm-option value="days" selected>Days</sm-option>
                            <sm-option value="months">Months</sm-option>
                        </sm-select>
                    </div>
                    <sm-input class="temp-task__reward flex-1" type="number" placeholder="Reward" animate>
                        <svg slot="icon" class="icon" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"> <g> <rect fill="none" height="24" width="24"></rect> </g> <g> <g> <path d="M13.66,7C13.1,5.82,11.9,5,10.5,5L6,5V3h12v2l-3.26,0c0.48,0.58,0.84,1.26,1.05,2L18,7v2l-2.02,0c-0.25,2.8-2.61,5-5.48,5 H9.77l6.73,7h-2.77L7,14v-2h3.5c1.76,0,3.22-1.3,3.46-3L6,9V7L13.66,7z"> </path> </g> </g> </svg>
                    </sm-input>
                </div>
                <div class="flex align-center gap-0-3 margin-top-1">
                    <button class="button cancel-task-button">
                        <svg class="icon margin-right-0-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"> <path fill="none" d="M0 0h24v24H0z" /> <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" /> </svg>
                        Cancel
                    </button>
                    <button type="submit" class="button button--primary add-task-button">
                        <svg class="icon margin-right-0-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"> <path fill="none" d="M0 0h24v24H0z" /> <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" /> </svg>
                        Add
                    </button>
                </div>
            </sm-form>
        </div>
    `;
        getRef('task_list').append(placeholderTask)
        getRef('task_list').querySelector('.temp-task__title').focusIn()
        getRef('add_task').classList.add('hidden')
        getRef('task_list').lastElementChild.scrollIntoView({ behavior: "smooth" });
    }
    function commitToChanges() {
        getConfirmation("Do you want to commit to changes?").then((result) => {
            if (result) {
                RIBC.admin.updateObjects().then(res => {
                    notify('Changes committed.', 'success')
                }).catch(err => {
                    console.error(err)
                })
            }
        })
    }
    function removeThisTask() {
        getConfirmation("Are you sure to delete this task?", { confirmText: 'Delete' }).then((result) => {
            if (result) {
                RIBC.admin.deleteTaskInMap(appState.params.id, appState.params.branch, currentTask.dataset.taskId)
                renderBranchTasks()
            }
        })
    }
    floGlobals.selectedInterns = new Set()
    delegate(getRef('intern_list_container'), 'change', '.intern-card', (e) => {
        const floId = e.target.closest('.intern-card').dataset.internFloId;
        if (e.target.checked) {
            floGlobals.selectedInterns.add(floId)
        } else {
            floGlobals.selectedInterns.delete(floId)
        }
        getRef('assign_interns_button').disabled = !floGlobals.selectedInterns.size
    })
    function assignSelectedInterns() {
        floGlobals.selectedInterns.forEach(floId => {
            RIBC.admin.assignInternToTask(floId, appState.params.id, appState.params.branch, currentTask.dataset.taskId)
            renderBranchTasks()
        })
        notify(`Assigned task`, 'success')
        closePopup()
    }

    function renderAllInterns() {
        renderElem(getRef('all_interns_list'), filterInterns('', { sortByRating: true }))
    }

    function changeScore(scoreUpdate) {
        let score = parseInt(getRef('intern_info__score').textContent)
        score += scoreUpdate;
        getRef('intern_info__score').textContent = score
        document.querySelectorAll(`[data-intern-flo-id="${currentIntern}"]`).forEach(internCard => {
            internCard.querySelector('.intern-card__score').textContent = score
        })
        if (score > 0) {
            getRef('reduce_score_button').disabled = false;
            RIBC.admin.updateInternRating(currentIntern, scoreUpdate)
        }
        if (score === 1 && scoreUpdate === -1) {
            getRef('reduce_score_button').disabled = true;
        }
    }

    function showNewBranchPopup() {
        openPopup('create_branch_popup')
        const startPoint = parseInt(currentTask.dataset.taskId)
        getRef('branch_start_point').value = startPoint;
    }
    getRef('create_branch_btn').onclick = () => {
        const startPoint = parseInt(currentTask.dataset.taskId)
        const userMergePoint = getRef('branch_merge_point').value.trim()
        const mergePoint = (userMergePoint === '') ? startPoint : parseInt(userMergePoint)
        const branchName = RIBC.admin.addBranch(appState.params.id, appState.params.branch, startPoint, mergePoint);
        notify(`Branch added ${branchName}`, 'success')
        renderBranches()
        closePopup()
    }

    function clearRequestFilters() {
        getRef('filter_requests_by_category').reset()
        getRef('filter_requests_by_project').reset()
    }

    function renderProjectSelectorOptions() {
        const options = [html`<sm-option value="all" selected>All</sm-option>`];
        RIBC.getProjectList().reverse().forEach(project => {
            options.push(html`<sm-option value="${project}">${RIBC.getProjectDetails(project).projectName}</sm-option>`);
        })
        renderElem(getRef('updates_page__project_selector'), html`${options}`)
    }
    function renderInternSelectorOptions() {
        const options = [html`<sm-option value="all" selected>All</sm-option>`];
        const allInterns = Object.entries(RIBC.getInternList()).sort((a, b) => a[1].toLowerCase().localeCompare(b[1].toLowerCase()));
        allInterns.forEach(intern => {
            options.push(html`<sm-option value="${intern[0]}">${intern[1]}</sm-option>`);
        })
        renderElem(getRef('updates_page__intern_selector'), html`${options}`)
    }

    function getUpdatesByProject(projectCode) {
        const projectName = RIBC.getProjectDetails(projectCode).projectName
        const allUpdates = RIBC.getInternUpdates()
        const filteredUpdates = allUpdates.filter(({ update: { projectCode: updateProjectCode } }) => {
            return projectCode === updateProjectCode
        })
        return filteredUpdates
    }

    function getUpdatesByIntern(floId, allUpdates = RIBC.getInternUpdates()) {
        return allUpdates.filter(update => update.floID === floId)
    }
    function getUpdatesByDate(date, allUpdates = RIBC.getInternUpdates()) {
        const filteredUpdates = []
        const dateStart = new Date(`${date} 00:00:00`).getTime()
        const dateEnd = new Date(`${date} 23:59:59`).getTime()
        let isFromDate = false
        for (const update of allUpdates) {
            if (update.time > dateStart && update.time < dateEnd) {
                filteredUpdates.push(update)
                isFromDate = true
            } else if (isFromDate) break
        }
        return filteredUpdates
    }
    let updatesLazyLoader
    function renderInternUpdates(updates = RIBC.getInternUpdates()) {
        if (updatesLazyLoader) {
            updatesLazyLoader.update(updates)
        } else {
            updatesLazyLoader = new LazyLoader('#all_updates_list', updates, render.internUpdateCard)
        }
        updatesLazyLoader.init()
    }
    delegate(getRef('all_updates_list'), 'click', '.init-update-replay', (e) => {
        const vectorClock = e.delegateTarget.closest('.intern-update').dataset.vectorClock;
        e.delegateTarget.after(html.node`
        <sm-form class="update-replay grid gap-0-5">
            <sm-textarea placeholder="Enter your reply here" class="update-reply-textarea" rows="4" required></sm-textarea>
            <div class="flex align-center gap-0-3 margin-left-auto">
                <button class="update-replay__cancel button button--small" onclick="cancelUpdateReply(this.closest('.update-replay'))">Cancel</button>
                <div class="multi-state-button">
                    <button class="update-replay__submit button button--small button--primary" onclick="submitUpdateReply(this.closest('.update-replay'))" type="submit">Submit</button>
                </div>
            </div>
        </sm-form>
    `)
        e.delegateTarget.classList.add('hidden')
        e.target.closest('.intern-update').querySelector('.update-reply-textarea').focusIn()
    })

    function cancelUpdateReply(replayBox) {
        replayBox.previousElementSibling.classList.remove('hidden')
        replayBox.remove()
    }
    function submitUpdateReply(replayBox) {
        buttonLoader(replayBox.querySelector('.update-replay__submit'), true)
        const vectorClock = replayBox.previousElementSibling.closest('.intern-update').dataset.vectorClock;
        const replyText = replayBox.querySelector('.update-reply-textarea').value.trim()
        if (replyText !== '') {
            RIBC.admin.commentInternUpdate(vectorClock, replyText).then(res => {
                replayBox.previousElementSibling.remove()
                replayBox.replaceWith(html.node`
                <div class="admin-reply grid">
                    <h4 class="admin-reply__title">Admin</h4>
                    <p class="admin-reply__description ws-pre-line wrap-around">${replyText}</p>
                </div>`)
            }).catch(err => {
                notify(err, 'error')
                buttonLoader(replayBox.querySelector('.update-replay__submit'), false)
            })
        }
    }
    function setUpdateFilters(filters) {
        const { projectCode, internId, date } = filters || getUpdateFilters()
        if (filters) {
            getRef('updates_page__project_selector').value = projectCode
            getRef('updates_page__intern_selector').value = internId
            getRef('updates_page__date_selector').value = date || ''
        } else {
            const dateParam = date !== '' ? `&date=${date}` : ''
            location.hash = `/updates_page?projectCode=${projectCode}&internId=${internId}${dateParam}`
        }
    }
    function getUpdateFilters() {
        const projectCode = getRef('updates_page__project_selector').value || 'all'
        const internId = getRef('updates_page__intern_selector').value || 'all'
        const date = getRef('updates_page__date_selector').value || ''
        return { projectCode, internId, date }
    }

    function clearUpdatesFilter() {
        getRef('updates_page__project_selector').reset()
        getRef('updates_page__intern_selector').reset()
        getRef('updates_page__date_selector').value = ''
        setUpdateFilters()
    }

    getRef('updates_page__project_selector').addEventListener('change', e => setUpdateFilters())
    getRef('updates_page__intern_selector').addEventListener('change', e => setUpdateFilters())
    getRef('updates_page__date_selector').addEventListener('change', e => setUpdateFilters())
    function pinProject(thisBtn) {
        const projectCode = thisBtn.closest('.pinned-card').dataset.id;
        pinnedProjects = localStorage.getItem(`${myFloID}_pinned_projects`) ? localStorage.getItem(`${myFloID}_pinned_projects`).split(',') : []
        if (pinnedProjects.includes(projectCode)) {
            pinnedProjects = pinnedProjects.filter(project => project !== projectCode)
        } else {
            pinnedProjects.push(projectCode)
        }
        localStorage.setItem(`${myFloID}_pinned_projects`, pinnedProjects.join())
        render.dashProjects(getRef('pinned_projects'), pinnedProjects)
        const unpinnedProjects = RIBC.getProjectList().filter(project => !pinnedProjects.includes(project)).reverse()
        if (unpinnedProjects.length > 0) {
            getRef('project_list_container').classList.remove('hidden')
        } else {
            getRef('project_list_container').classList.add('hidden')
        }
        render.dashProjects(getRef('project_list'), unpinnedProjects)
    }

    let sessionTaskRequests = new Set();
    function requestForTask(btn) {
        hideTaskDetails()
        try {
            floDapps.user.id
            const taskId = btn ? btn.dataset.taskId : floGlobals.tempUserTaskRequest
            floGlobals.tempUserTaskRequest = taskId
            if (typeOfUser === 'general') {
                getRef('intern_apply__task').textContent = RIBC.getAllTasks()[taskId].title
                openPopup('apply_for_task_popup', true)
            } else if (typeOfUser === 'intern') {
                const hasApplied = [...RIBC.getTaskRequests(false), ...sessionTaskRequests].find(({ details }) => {
                    return taskId === details.taskId
                })
                if (hasApplied) {
                    notify('You have already applied for this task', 'error')
                } else {
                    if (floGlobals.assignedTasks.has(taskId))
                        return notify('You have already been assigned this task', 'error');
                    const [projectCode, branch, task] = taskId.split('_')
                    const { title } = RIBC.getTaskDetails(projectCode, branch, task)
                    getConfirmation(`Do you want to apply for "${title}"`, { confirmText: 'Apply' }).then((result) => {
                        if (result) {
                            if (btn) {
                                btn.textContent = 'Applying...'
                                btn.disabled = true
                            }
                            RIBC.applyForTask({ taskId }).then((result) => {
                                notify('Applied successfully.', 'success')
                                sessionTaskRequests.add({ details: { taskId } })
                                floGlobals.tempUserTaskRequest = null
                                btn.textContent = 'Applied'
                            }).catch((err) => {
                                if (btn) {
                                    btn.textContent = 'Apply'
                                    btn.disabled = false
                                }
                                notify(err, 'error')
                            })
                        }
                    }).catch((error) => {
                        notify(error, 'error')
                    })
                }
            }
        } catch (err) {
            floGlobals.tempUserTaskRequest = btn.dataset.taskId;
            location.hash = '#/sign_in'
            floGlobals.signInNotification = notify('Please login to apply for task.')
        }
    }

    function toggleUpdatesFilter() {
        getRef('update_filters_wrapper').classList.toggle('hide-on-mobile')
    }
    // Event listeners
    delegate(getRef('all_interns_page'), 'click', '.intern-card', e => {
        showInternInfo(e.delegateTarget.dataset.internFloId)
    })
    delegate(getRef('admin_page__intern_list'), 'click', '.intern-card', e => {
        showInternInfo(e.delegateTarget.dataset.internFloId)
    })

    document.addEventListener('popupopened', e => {
        getRef('main_page').setAttribute('inert', '')
        switch (e.detail.popup.id) {
            case 'intern_list_popup':
                renderElem(getRef('intern_list_container'), filterInterns('', { availableInternsOnly: true }))
                break;
        }
    })
    document.addEventListener('popupclosed', e => {
        switch (e.detail.popup.id) {
            case 'intern_list_popup':
                renderElem(getRef('intern_list_container'), html``)
                getRef('intern_search_field').value = ''
                floGlobals.selectedInterns.clear()
                getRef('assign_interns_button').disabled = true
                break;
        }
        if (popupStack.items.length === 0) {
            getRef('main_page').removeAttribute('inert')
        }
    })

    floGlobals.assignedTasks = new Set()

    function renderAllElements() {

        let sortedProjectList = getSortedProjectList()
        document.querySelectorAll('.open-first-project').forEach(link => {
            link.href = `${link.href}/project?id=${sortedProjectList[0]}&branch=mainLine`
        })

        pinnedProjects = localStorage.getItem(`${myFloID}_pinned_projects`) ? localStorage.getItem(`${myFloID}_pinned_projects`).split(',') : []

        // Intern's view

        if (RIBC.getInternList()[myFloID] && !floGlobals.subAdmins.includes(myFloID)) {
            typeOfUser = 'intern';
            document.querySelectorAll('.intern-option').forEach((option) => {
                option.classList.remove('hidden')
            })
            floGlobals.assignedProjectsList = new Set();
            // store all the projects assigned to interns in array
            const allTasks = RIBC.getAllTasks()
            for (const taskKey in allTasks) {
                const [projectCode, branch, task] = taskKey.split('_')
                const assignedInterns = RIBC.getAssignedInterns(projectCode, branch, task)
                if (Array.isArray(assignedInterns) && assignedInterns.includes(myFloID)) {
                    floGlobals.assignedProjectsList.add(projectCode)
                    if (RIBC.getTaskStatus(projectCode, branch, task) === 'incomplete') {
                        floGlobals.assignedTasks.add(taskKey);
                    }
                }
            }
        } else {
            document.querySelectorAll('.intern-option').forEach((option) => {
                option.classList.add('hidden')
            })
        }

        // admin view
        if (floGlobals.subAdmins.includes(myFloID)) {
            typeOfUser = 'admin'
            function removeRequest(requestCard) {
                requestCard.animate([
                    {
                        transform: 'translateX(0)',
                        opacity: 1
                    },
                    {
                        transform: 'translateX(-100%)',
                        opacity: 0
                    },
                ], {
                    duration: floGlobals.prefersReducedMotion ? 0 : 300,
                    easing: 'ease'
                }).onfinish = () => {
                    requestCard.remove()
                }
            }
            render.internRequests()
            // accept task request
            delegate(getRef('requests_list'), 'click', '.accept-request', (e) => {
                getConfirmation('Are you sure you want to accept this request?').then(result => {
                    if (result) {
                        const vectorClock = e.delegateTarget.closest('.request-card').dataset.vectorClock
                        let result
                        if (RIBC.getInternList())
                            result = RIBC.admin.processTaskRequest(vectorClock, true)
                        if (result === 'Accepted') {
                            notify('Intern assigned, commit changes to make it permanent.', 'success')
                            removeRequest(e.delegateTarget.closest('.request-card'))
                        }
                    }
                })
            })
            // reject task request
            delegate(getRef('requests_list'), 'click', '.reject-request', (e) => {
                getConfirmation('Are you sure you want to reject this request?').then((result) => {
                    if (result) {
                        const vectorClock = e.delegateTarget.closest('.request-card').dataset.vectorClock
                        const type = e.delegateTarget.closest('.request-card').dataset.type
                        let result
                        if (type === 'task') {
                            result = RIBC.admin.processTaskRequest(vectorClock, false)
                            if (result === 'Rejected') {
                                notify('Request rejected', 'success')
                                removeRequest(e.delegateTarget.closest('.request-card'))
                            }
                        } else if (type === 'internship') {
                            result = RIBC.admin.processInternRequest(vectorClock, false)
                            if (result === 'Rejected') {
                                notify('Request rejected', 'success')
                                removeRequest(e.delegateTarget.closest('.request-card'))
                            }
                        }
                    }
                })
            })

            document.querySelectorAll('.admin-option').forEach((option) => {
                option.classList.remove('hidden')
            })

            //show interns
            renderElem(getRef('admin_page__intern_list'), filterInterns(''))

            //show projects
            render.projectList(getRef('admin_page__project_list'), getSortedProjectList(), true)
        } else {
            document.querySelectorAll('.admin-option').forEach((option) => {
                option.classList.add('hidden')
            })
        }

        // General only view for non admin and non intern
        if (!RIBC.getInternList()[myFloID] && !floGlobals.subAdmins.includes(myFloID)) {
            document.querySelectorAll('.general-only').forEach((elem) => {
                elem.classList.remove('hidden')
            })
        }
        else {
            document.querySelectorAll('.general-only').forEach((elem) => {
                elem.classList.add('hidden')
            })
        }
        if (typeOfUser === 'admin') {
            document.querySelectorAll('.not-for-admin').forEach((elem) => {
                elem.classList.add('hidden')
            })
        } else {
            document.querySelectorAll('.not-for-admin').forEach((elem) => {
                elem.classList.remove('hidden')
            })
        }

        if (typeOfUser === 'intern') {
            render.projectList(getRef('my_projects'), [...floGlobals.assignedProjectsList])
            sortedProjectList = sortedProjectList.filter(val => !floGlobals.assignedProjectsList.has(val));
        }
        if (sortedProjectList.length > 0) {
            getRef('other_projects').previousElementSibling.classList.remove('hidden')
            render.projectList(getRef('other_projects'), sortedProjectList)
        } else {
            getRef('other_projects').previousElementSibling.classList.add('hidden')
        }
        delegate(getRef('explorer_task_list'), 'click', '.apply-button', e => {
            requestForTask(e.delegateTarget)
        })
        getRef('user_flo_id').value = myFloID;
    }

    let currentTaskId;
    function initTaskUpdate(e) {
        const taskCard = e.target.closest('.task-card')
        currentTaskId = taskCard.dataset.uniqueId
        const [projectCode, branch, task] = currentTaskId.split('_')
        getRef('update_of_project').textContent = RIBC.getProjectDetails(projectCode).projectName
        getRef('update_of_task').textContent = RIBC.getTaskDetails(projectCode, branch, task).title
        openPopup('post_update_popup')
    }

    function postUpdate() {
        const [projectCode, branch, task] = currentTaskId.split('_')
        const description = getRef('update__brief').value.trim()
        const linkText = getRef('update__link').value.trim()
        const link = linkText !== '' ? linkText : null
        if (description !== '') {
            RIBC.postInternUpdate({ projectCode, branch, task, description, link })
                .then((result) => {
                    notify('Update posted', 'success')
                    closePopup()
                })
                .catch((error) => {
                    notify(error, 'error')
                })
        }
        else {
            notify('Please enter description', 'error')
        }
    }
    function filterInterns(searchKey, options = {}) {
        const {
            sortByRating = false,
            availableInternsOnly = false
        } = options
        let filtered = [];
        const allInterns = RIBC.getInternList();
        const highPerformingInterns = Object.keys(allInterns).sort((a, b) => {
            return RIBC.getInternRating(b) - RIBC.getInternRating(a)
        });
        let arrayOfInterns = Object.keys(allInterns).sort((a, b) => {
            return allInterns[a].toLowerCase().localeCompare(allInterns[b].toLowerCase())
        })
        if (availableInternsOnly) {
            arrayOfInterns = arrayOfInterns.filter(intern => !RIBC.getAssignedInterns(appState.params.id, appState.params.branch, currentTask.dataset.taskId)?.includes(intern))
        }
        if (searchKey === '') {
            filtered = (sortByRating ? highPerformingInterns : arrayOfInterns).map(floId => {
                return render.internCard(floId, { selectable: availableInternsOnly })
            })
        } else {
            filtered = filterMap(arrayOfInterns, (floId) => {
                if (allInterns[floId].toLowerCase().includes(searchKey.toLowerCase())) {
                    return render.internCard(floId, { selectable: availableInternsOnly })
                }
            })
        }
        return html`${filtered}`
    }
    const searchInternPopup = debounce((e) => {
        renderElem(getRef('intern_list_container'), filterInterns(e.target.value.trim(), { availableInternsOnly: true }))
    }, 150)
    const searchInternPage = debounce((e) => {
        renderElem(getRef('all_interns_list'), filterInterns(e.target.value.trim(), { sortByRating: true }))
    }, 150)
    getRef('intern_search_field').addEventListener('input', searchInternPopup)
    getRef('interns_page__search').addEventListener('input', searchInternPage)


    function applyForInternship() {
        buttonLoader(getRef('intern_apply__button'), true)
        const name = getRef('intern_apply__name').value.trim();
        const contact = getRef('intern_apply__contact').value.trim();
        const brief = getRef('intern_apply__brief').value.trim();
        // const resumeLink = getRef('intern_apply__resume_link').value.trim();
        const portfolioLink = getRef('intern_apply__portfolio_link').value.trim();
        const details = {
            name,
            brief,
            // resumeLink,
            contact,
            portfolioLink: portfolioLink !== '' ? portfolioLink : null,
            taskId: floGlobals.tempUserTaskRequest
        }
        RIBC.applyForTask(details)
            .then((result) => {
                notify('Application submitted', 'success')
                closePopup()
            })
            .catch((error) => {
                notify(error, 'error')
            }).finally(() => {
                buttonLoader(getRef('intern_apply__button'), false)
                floGlobals.tempUserTaskRequest = null
            })
    }

    function getSortedProjectList() {
        return RIBC.getProjectList().sort((a, b) => RIBC.getProjectDetails(a).projectName.toLowerCase().localeCompare(RIBC.getProjectDetails(b).projectName.toLowerCase()))
    }


    function getSignedIn(passwordType) {
        return new Promise((resolve, reject) => {
            try {
                getPromptInput('Enter password', '', {
                    isPassword: true,
                }).then(password => {
                    if (password) {
                        resolve(password)
                    }
                })
            } catch (err) {
                if (passwordType === 'PIN/Password') {
                    floGlobals.isPrivKeySecured = true;
                    getRef('private_key_field').removeAttribute('data-private-key');
                    getRef('private_key_field').setAttribute('placeholder', 'Password');
                    getRef('private_key_field').customValidation = null
                    getRef('secure_pwd_button').closest('.card').classList.add('hidden');
                } else {
                    floGlobals.isPrivKeySecured = false;
                    getRef('private_key_field').dataset.privateKey = ''
                    getRef('private_key_field').setAttribute('placeholder', 'FLO private key');
                    getRef('private_key_field').customValidation = floCrypto.getPubKeyHex;
                    getRef('secure_pwd_button').closest('.card').classList.remove('hidden');
                }
                if (!generalPages.find(page => window.location.hash.includes(page))) {
                    location.hash = floGlobals.isPrivKeySecured ? '#/sign_in' : `#/landing`;
                }
                getRef('sign_in_button').onclick = () => {
                    resolve(getRef('private_key_field').value.trim());
                    getRef('private_key_field').value = '';
                    routeTo('loading');
                    getRef("notification_drawer").remove(floGlobals.signInNotification)
                };
                getRef('sign_up_button').onclick = () => {
                    resolve(getRef('generated_private_key').value);
                    getRef('generated_private_key').value = '';
                    routeTo('loading');
                    getRef("notification_drawer").remove(floGlobals.signInNotification)
                };
            }
        });
    }
    function setSecurePassword() {
        if (!floGlobals.isPrivKeySecured) {
            const password = getRef('secure_pwd_input').value.trim();
            floDapps.securePrivKey(password).then(() => {
                floGlobals.isPrivKeySecured = true;
                notify('Password set successfully', 'success');
                getRef('secure_pwd_button').closest('.card').classList.add('hidden');
                closePopup();
            }).catch(err => {
                notify(err, 'error');
            })
        }
    }
    function signOut() {
        getConfirmation('Sign out?', { message: 'You are about to sign out of the app, continue?', confirmText: 'Leave', cancelText: 'Stay' })
            .then(async (res) => {
                if (res) {
                    await floDapps.clearCredentials();
                    location.reload();
                }
            });
    }
    // detect url within text and convert to link
    function linkify(inputText) {
        let replacedText, replacePattern1, replacePattern2, replacePattern3;
        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
        //Change email addresses to mailto:: links.
        replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
        return replacedText;
    }