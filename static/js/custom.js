window.activeProject = {
    backendUrl: '/api/v1/projects/session',
    localStorageKey: 'selectedProject',
    fetch: async () => {
        const resp = await fetch(activeProject.backendUrl)
        if (resp.ok) {
            const projectData = await resp.json()
            return projectData.id
        }
        return null
    },
    get: async () => {
        let projectId = localStorage.getItem(activeProject.localStorageKey)
        if (projectId === null) {
            projectId = await activeProject.fetch().then(id => {
                id === null ?
                    activeProject.delete()
                    :
                    activeProject.set_local(id)
                return id
            })
        }
        return projectId
    },
    set: async id => {
        // console.log('setting proj id', id)
        const resp = await fetch(`${activeProject.backendUrl}/${id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: {}
        })
        if (resp.ok) {
            const resp_msg = await resp.json()
            activeProject.set_local(id)
            return id
        } else {
            activeProject.delete()
            return null
        }
    },
    set_local: id => localStorage.setItem(activeProject.localStorageKey, id),
    delete: () => localStorage.removeItem(activeProject.localStorageKey)
}

window.getSelectedProjectId = () => localStorage.getItem(activeProject.localStorageKey)
$(document).on('vue_init', () => window.getSelectedProjectId = () => vueVm.project_id)

window.wait_for = async (prop_name, root = window, poll_length = 500) => {
    while (!root.hasOwnProperty(prop_name))
        await new Promise(resolve => setTimeout(resolve, poll_length))
    return root[prop_name]
}
