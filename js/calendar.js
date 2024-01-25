document.addEventListener('DOMContentLoaded', function () {

  var calendarEl = document.getElementById('calendar');
  const msg = document.getElementById("msg");
  const btnCreateEvent = document.getElementById("btnCreateEvent");
  const createModal = new bootstrap.Modal(document.getElementById("createModal"));
  var cachedEvents = [];
  const msgCreateEvent = document.getElementById("msgCreateEvent")
  const viewModal = new bootstrap.Modal(document.getElementById("viewModal"));
  const msgDeleteEvent = document.getElementById("msgDeleteEvent");
  const storedToken = localStorage.getItem("token");
 
  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    navLinks: true,
    selectable: true,
    selectMirror: true,
    initialView: 'dayGridMonth',
    themeSystem: 'bootstrap5',


    eventSources: [
      function (fetchInfo, successCallback, failureCallback) {
        fetchEvents(storedToken)
          .then(data => {
            const mappedEvents = data.map(event => ({
              id: event.id,
              title: event.title,
              start: event.start_date,
              end: event.end_date,
              color: event.color
            }));
            const newEvents = mappedEvents.filter(newEvent => !cachedEvents.some(cachedEvent => cachedEvent.id === newEvent.id));
            cachedEvents = cachedEvents.concat(newEvents);
            successCallback(mappedEvents);
          })
          .catch(error => {
            console.error('Error fetching events:', error);
            failureCallback(error);
          });
      }
    ],
    
    select: function (info) {
      document.getElementById("start_date").value = convertDate(info.start);
      document.getElementById("end_date").value = convertDate(info.start);
      createModal.show();
      
    },


    eventClick: function (info) {

      viewModal.show();
      document.getElementById("viewEvent").style.display = "block";
      document.getElementById("viewModalLabel").style.display = "block";
      document.getElementById("formEditEvent").style.display = "none";
      document.getElementById("editModalLabel").style.display = "none";

      

      document.getElementById("modalId").innerText = info.event.id;
      document.getElementById("modalTitle").innerText = info.event.title;
      document.getElementById("modalStart").innerText = info.event.start.toLocaleString();
      document.getElementById("modalEnd").innerText = info.event.end !== null ? info.event.end.toLocaleString()
        : info.event.start.toLocaleString();

      document.getElementById("edit_id").value = info.event.id;
      document.getElementById("edit_title").value = info.event.title;
      document.getElementById("edit_start_date").value = convertDate(info.event.start);
      document.getElementById("edit_end_date").value = info.event.end !== null ? convertDate(info.event.end)
        : convertDate(info.event.start);
      document.getElementById("edit_color").value = info.event.backgroundColor;
    },

    longPressDelay: 50,
    editable: true,
    dayMaxEvents: true,

  });

  

  function convertDate(data) {

    const dataObj = new Date(data);

    const year = dataObj.getFullYear();


    const month = String(dataObj.getMonth() + 1).padStart(2, '0');
    const day = String(dataObj.getDate()).padStart(2, '0');
    const hour = String(dataObj.getHours()).padStart(2, '0');
    const minute = String(dataObj.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}`;
  }

  const formCreateEvent = document.getElementById("formCreateEvent");

  if (formCreateEvent) {
    formCreateEvent.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(formCreateEvent);
      const eventData = {};
      btnCreateEvent.value = "Saving ..."

      formData.forEach((value, key) => {
        eventData[key] = value;
      });

      
      const api = "https://test-healthbook-deploy.onrender.com/api/calendar";

      try {
        const response = await fetch(api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + storedToken
          },
          body: JSON.stringify(eventData),
        });
        
        if (response.ok) {

          msg.innerHTML = `<div class="alert alert-success" role="alert">
          ${"Successfuly created a new event!"}
          </div>`;
          
          formCreateEvent.reset();
          createModal.hide();
          removeMsg();
          msgCreateEvent.innerText = "";
          calendar.refetchEvents();
        } else {
          msgCreateEvent.innerHTML =
            `<div class="alert alert-danger" role="alert">
          ${"Failed to create a new event"}
          </div>`;
          console.error('Error on creating event:', response.statusText, response.body);
        }
      } catch (error) {
        msgCreateEvent.innerHTML =
          `<div class="alert alert-danger" role="alert">
        ${"Failed to create a new event"}
        </div>`;
        console.error('Error during request:', error.message);
      }
    });

    btnCreateEvent.value = "Create Event"
  }

  function removeMsg() {
    setTimeout(() => {
      document.getElementById('msg').innerHTML = "";
    }, 3000)
  }
  calendar.render();

  const btnViewEditEvent = document.getElementById("btnViewEditEvent");

  if (btnViewEditEvent) {
    btnViewEditEvent.addEventListener("click", () => {

      document.getElementById("viewEvent").style.display = "none";
      document.getElementById("viewModalLabel").style.display = "none";
      document.getElementById("formEditEvent").style.display = "block";
      document.getElementById("editModalLabel").style.display = "block";
    });
  }

  const btnViewEvent = document.getElementById("btnViewEvent");

  if (btnViewEvent) {
    btnViewEvent.addEventListener("click", () => {

      document.getElementById("viewEvent").style.display = "block";
      document.getElementById("viewModalLabel").style.display = "block";
      document.getElementById("formEditEvent").style.display = "none";
      document.getElementById("editModalLabel").style.display = "none";
    });
  }

  const formEditEvent = document.getElementById("formEditEvent");
  const msgEditEvent = document.getElementById("msgEditEvent");
  const btnEditEvent = document.getElementById("btnEditEvent");



  formEditEvent.addEventListener("submit", async (e) => {

    e.preventDefault();
    btnEditEvent.value = "Saving ...";
    const formData = new FormData(formEditEvent);
    const id = document.getElementById("edit_id").value;
    
    const url = `https://test-healthbook-deploy.onrender.com/api/calendar/${id}`;
    const updatedEvent = {
      id: id,
      title: formData.get("edit_title"),
      start_date: formData.get("edit_start_date"),
      end_date: formData.get("edit_end_date"),
      color: formData.get("edit_color"),
    };


    try {
      const response = await fetch(url, {

        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + storedToken
        },
        body: JSON.stringify(updatedEvent)
      });
      if (response.ok) {
        msg.innerHTML = `<div class="alert alert-success" role="alert">
          ${"Successfuly updated event!"}
          </div>`;

        
        formEditEvent.reset();
        viewModal.hide();
        removeMsg();
        msgEditEvent.innerText = "";

        const updateFrontEnd = calendar.getEventById(id);
        if (updateFrontEnd) {

          updateFrontEnd.setProp('title', updatedEvent.title);
          updateFrontEnd.setProp('color', updatedEvent.color);
          updateFrontEnd.setStart(updatedEvent.setStart);
          updateFrontEnd.setEnd(updatedEvent.setEnd);
        }


      }
      else {

        msgEditEvent.innerHTML =
          `<div class="alert alert-danger" role="alert">
        ${"Failed to update the event"}
        </div>`;
        console.error('Error on creating event:', response.statusText, response.body);
        throw new Error(`Request error: ${response.statusText}`);
      }

    } catch (error) {
      msgCreateEvent.innerHTML =
        `<div class="alert alert-danger" role="alert">
        ${"Failed to update the event"}
        </div>`;
      console.error('Error on creating event:', response.statusText, response.body);
    }

    btnEditEvent.value = "Save";
  });

  const btnDeleteEvent = document.getElementById("btnDeleteEvent");

  if (btnDeleteEvent) {

    btnDeleteEvent.addEventListener("click", async () => {
      const confirmation = window.confirm("Are you sure you want to delete this event? This action cannot be undone");

      if (confirmation) {
        const idEvent = document.getElementById("modalId").textContent;


        const url = `https://test-healthbook-deploy.onrender.com/api/calendar/${idEvent}`;
        try {
          const response = await fetch(url, {
            method: "DELETE",
            headers: {
              'Authorization': 'Bearer ' + storedToken
            }
          });
          if (response.ok) {

            msg.innerHTML = `<div class="alert alert-success" role="alert">
          ${"Successfuly deleted event!"}
          </div>`;
            removeMsg();
            viewModal.hide();
            msgEditEvent.innerText = "";

            const eventToRemove = calendar.getEventById(idEvent);
            if (eventToRemove) {
              
              eventToRemove.remove();
            }
          }
          else {
            msgDeleteEvent.innerHTML = `<div class="alert alert-danger" role="alert">
          ${"Failed to delete the event"}
          </div>`;
          }
        }
        catch (error) {
          msgDeleteEvent.innerHTML = `<div class="alert alert-danger" role="alert">
          ${"Failed to delete the event"}
          </div>`;
        }
      }

    });
  }

});

async function fetchEvents(token) {
    const url = 'https://test-healthbook-deploy.onrender.com/api/calendar/all';
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        });

        if (!response.ok) {
            throw new Error(`Request error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}
