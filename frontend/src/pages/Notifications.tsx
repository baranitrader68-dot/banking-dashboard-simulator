import { useEffect, useState } from "react";

type Notification = {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

function Notifications() {
  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userId = storedUser.id;

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  // =========================
  // GET NOTIFICATIONS
  // =========================

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `http://https://banking-dashboard-simulator.onrender.com/api/notification/${userId}`
      );

      const data =
        await response.json();

      if (response.ok) {
        setNotifications(data);
      }

    } catch (error) {
      console.error(
        "Failed to fetch notifications",
        error
      );
    }
  };

  // =========================
  // LOAD NOTIFICATIONS
  // =========================

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  // =========================
  // MARK AS READ
  // =========================

  const markAsRead = async (
    notificationId: number
  ) => {
    try {
      await fetch(
        `http://https://banking-dashboard-simulator.onrender.com/api/notification/${notificationId}/read`,
        {
          method: "PATCH",
        }
      );

      fetchNotifications();

    } catch (error) {
      console.error(
        "Failed to mark notification as read",
        error
      );
    }
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold text-gray-800">
        Notifications 🔔
      </h1>

      <p className="text-gray-600 mt-2">
        Stay updated with your banking activities.
      </p>

      <div className="mt-8 space-y-4">

        {notifications.length === 0 ? (

          <div className="bg-white p-6 rounded-2xl shadow">

            <p className="text-gray-500">
              No notifications yet.
            </p>

          </div>

        ) : (

          notifications.map(
            (notification) => (

              <div
                key={notification.id}
                className={`bg-white p-6 rounded-2xl shadow border-l-4 ${
                  notification.isRead
                    ? "border-gray-300"
                    : "border-blue-600"
                }`}
              >

                <div className="flex justify-between items-start">

                  <div>

                    <h2 className="font-bold text-lg">
                      {notification.title}
                    </h2>

                    <p className="text-gray-600 mt-2">
                      {notification.message}
                    </p>

                    <p className="text-sm text-gray-400 mt-3">

                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}

                    </p>

                  </div>

                  {!notification.isRead && (

                    <button
                      onClick={() =>
                        markAsRead(
                          notification.id
                        )
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Mark as Read
                    </button>

                  )}

                </div>

              </div>

            )
          )

        )}

      </div>

    </div>
  );
}

export default Notifications;