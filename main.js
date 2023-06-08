async function process_argv() {
    let { argv } = process;
    argv = argv.slice(2);
    const result = await studentActivitiesRegistration(argv);

    return result;
}

async function getStudentActivities() {
    try {
        const response = await fetch('http://localhost:3001/activities');
        const data = await response.json();
        const activities = data.map((activity) => ({
            id: activity.id,
            name: activity.name,
            desc: activity.desc,
            days: activity.days,
        }));
        return activities;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function studentActivitiesRegistration(data) {
    if (data[0] === 'CREATE') {
        return getStudentActivities()
            .then(activities => {
                const getActivitiesByFilter = activities.filter(value => value.days.includes(data[2]));

                const newData = {
                    name: data[1],
                    activities: getActivitiesByFilter.map(value => ({
                        name: value.name,
                        desc: value.desc,
                    })),
                };

                return fetch('http://localhost:3001/students', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newData),
                })
                    .then(res => res.json())
                    .then(datas => ({
                        id: datas.id,
                        name: datas.name,
                        activities: datas.activities.map(activity => ({ name: activity.name, desc: activity.desc })),
                    }))
                    .catch(error => error);
            })
            .catch(error => error);
    } else if (data[0] === 'DELETE') {
        return fetch(`http://localhost:3001/students/${data[1]}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => ({ message: `Successfully deleted student data with id ${data[1]}` }))
            .catch(error => error);
    }
}

async function addStudent(name, day) {
    return getStudentActivities()
        .then(activities => {
            const getActivitiesByFilter = activities.filter(value => value.days.includes(day));

            const newStd = {
                name: name,
                activities: getActivitiesByFilter.map(value => ({
                    name: value.name,
                    desc: value.desc,
                })),
            };

            return fetch('http://localhost:3001/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStd),
            })
                .then(res => res.json())
                .then(data => ({
                    id: data.id,
                    name: data.name,
                    activities: data.activities.map(activity => ({ name: activity.name, desc: activity.desc })),
                }))
                .catch(error => error);
        })
        .catch(error => error);
}

async function deleteStudent(id) {
    return fetch(`http://localhost:3001/students/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(() => ({ message: `Successfully deleted student data with id ${id}` }))
        .catch(error => error);
}


process_argv()
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = {
    studentActivitiesRegistration,
    getStudentActivities,
    addStudent,
    deleteStudent
};
