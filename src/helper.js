export function getStartEndDateForProject(tasks, projectId) {
  const projectTasks = tasks.filter((t) => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}

export const formatDate = (date) => {
  const dateObject = new Date(date);
  const formatted = dateObject.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }); // check the output here
  return formatted;
};

export const downloadFile = (file) => {
  console.log(file);
  const blob = new Blob([file.data], { type: file.data.type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export function initTasks() {
  const currentDate = new Date();
  const tasks = [
    {
      name: "task1",
      startDate: "2023-02-02T10:04:28.359Z",
      endDate: "2023-04-02T10:04:28.359Z",
      progress: 90,
      id: "task1",
      type: "task",
    },
    {
      name: "task2",
      startDate: "2023-02-02T10:04:28.359Z",
      endDate: "2023-04-02T10:04:28.359Z",
      progress: 90,
      id: "task2",
      type: "task",
    },
    {
      name: "task3",
      startDate: "2023-02-02T10:04:28.359Z",
      endDate: "2023-04-02T10:04:28.359Z",
      progress: 90,
      id: "task3",
      type: "task",
    },
    {
      name: "task4",
      startDate: "2023-02-02T10:04:28.359Z",
      endDate: "2023-03-04T10:04:28.359Z",
      progress: 90,
      id: "task4",
      type: "task",
    },
    {
      name: "task5",
      startDate: "2023-02-02T10:04:28.359Z",
      endDate: "2023-04-02T10:04:28.359Z",
      progress: 90,
      id: "task5",
      type: "task",
    },
  ];
  return tasks;
}
