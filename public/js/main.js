if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register(`/sw.js`)
      .then(function () {
        //installAutomation();
      })
      .catch(function () {});
  });
}

function installAutomation() {
  let deferredPrompt;
  const addBtn = document.querySelector("#installApp");
  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    // addBtn.style.display = 'block';
    addBtn.addEventListener("click", (e) => {
      // hide our user interface that shows our A2HS button
      // addBtn.style.display = 'none';
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          // $('#Modal_Home_Screen').removeClass('active');
        } else {
        }
        deferredPrompt = null;
      });
    });
  });
}

window.onload = function () {
  if (window.location.pathname === "/Setting") {
    var notificationButton = document.querySelector(".notification-button");
  }

  function modifyNotificationButton() {
    notificationButton.innerText = "نوتیفیکیشن فعال است!";
    notificationButton.disabled = true;
  }

  function showSuccessMessage(message) {
    var options = {
      body: "از این پس برای شما نوتیفیکیشن ارسال می شود!",
      // icon: '/assets/images/icons/icon-96x96.png',
      // image: '/assets/images/icons/icon-96x96.png',
      // badge: '/assets/images/icons/icon-96x96.png',
      dir: "rtl", // 'auto' | 'ltr' | 'rtl',
      lang: "fa-IR",
      //vibrate: [100, 50, 200],
    };
    //new Notification('Subscription granted!', options);
    navigator.serviceWorker.ready.then(function (registeration) {
      registeration.showNotification(message, options);
    });
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function storePushSub() {
    var swreq;
    navigator.serviceWorker.ready
      .then(function (req) {
        swreq = req;
        return req.pushManager.getSubscription();
      })
      .then(function (pushSubscription) {
        if (pushSubscription) {
          return;
        }
        var privateKey = "n6jpaASQbMQt3J1ySkLtpLKsqeuf11yPI7RPN6e1M_k";
        const vapidPublicKey =
          "BLAiazjQIVW4l3DR-cMfY4-affoUhnukETKid2b3xzVVwqj1yIgQeLyFaqOOxC53zGmzQWwhVHl8YUxq0hZqy80";
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
        return swreq.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          })
          .then(function (newPushSubscription) {
            const subs = {
              endpoint: newPushSubscription.endpoint,
              keys: {
                auth: newPushSubscription.toJSON().keys.auth,
                p256dh: newPushSubscription.toJSON().keys.p256dh,
              },
              userId: localStorage.getItem("id"),
            };
            return postSubscription(subs);
          });
      });
  }

  function requestPermission() {
    Notification.requestPermission(function (userChoice) {
      if (userChoice === "denied") {
      } else {
        storePushSub();
        showSuccessMessage("نوتیفیکیشن فعال شد!");
      }
    });
  }

  if (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    notificationButton !== undefined
  ) {
    if (Notification.permission === "granted") {
      modifyNotificationButton();
    } else {
      notificationButton.addEventListener("click", requestPermission);
    }
  } else {
    if (notificationButton !== undefined) {
      notificationButton.style.display = "none";
    }
  }

  function postSubscription(subs) {
    // return fetch('http://s-mirzaei:5006/endPoint', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     },
    //     body: JSON.stringify(subs)
    // });

    // return fetch('http://172.30.1.212:5006/endPoint', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     },
    //     body: JSON.stringify(subs)
    // });

    // "localapi": "http:/185.134.96.77:9080"
    return fetch("http://185.134.96.77:9080/endPoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(subs),
    });
  }

  window.addEventListener(
    "resize",
    function (event) {
      const routeContent = document.getElementById("routeContent");
      const sideBar = document.getElementById("sidebarContent");
      if (window.innerWidth < 1200 && routeContent.classList.contains("w-95")) {
        routeContent.classList.remove("w-95");
      } else if (
        window.innerWidth >= 1200 &&
        sideBar.classList.contains("w-5")
      ) {
        routeContent.classList.add("w-95");
      }
    },
    true
  );
};
