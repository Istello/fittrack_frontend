import URL from "./url.js";
import { refreshAccessToken } from "./accessExpired.js";

const dashboard = {
  profile: null,
  history: [],
};

async function apiRequest(endpoint, options = {}, retry = true) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${URL()}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });

  if (response.status === 401 && retry) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      return apiRequest(endpoint, options, false);
    }

    localStorage.clear();
    window.location.href = "login.html";
    return null;
  }

  return response;
}

async function loadProfile() {
  try {
    const response = await apiRequest("/users/profile");
    if (!response) return;

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Unable to load profile.");
    }

    dashboard.profile = data;
    updateProfileUI();
  } catch (error) {
    console.error("Profile error:", error);
  }
}

function updateProfileUI() {
  if (!dashboard.profile) return;

  const user = dashboard.profile;
  const username = user.username || "User";

  const avatar = document.getElementById("userAvatar");
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");
  const welcomeName = document.getElementById("welcomeName");

  if (avatar) avatar.textContent = username.charAt(0).toUpperCase();
  if (userName) userName.textContent = username;
  if (userEmail) userEmail.textContent = user.email || "";
  if (welcomeName) welcomeName.textContent = username;
}

async function loadBMIHistory() {
  try {
    const response = await apiRequest("/bmi/history");
    if (!response) return;

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Unable to load BMI history.");
    }

    dashboard.history = data.bmis || [];
    updateDashboardStats();
    renderHistory();
  } catch (error) {
    console.error("BMI history error:", error);
  }
}

function updateDashboardStats() {
  const totalRecords = document.getElementById("totalRecords");
  if (totalRecords) totalRecords.textContent = dashboard.history.length;

  if (!dashboard.history.length) return;

  const latest = dashboard.history[dashboard.history.length - 1];

  const bmiValue = Number(latest.bmi);
  const height = Number(latest.height);
  const weight = Number(latest.weight);

  const currentBmi = document.getElementById("currentBmi");
  const currentWeight = document.getElementById("currentWeight");
  const currentHeight = document.getElementById("currentHeight");
  const bmiStatus = document.getElementById("bmiStatus");
  const bmiMessage = document.getElementById("bmiMessage");
  const lastUpdated = document.getElementById("lastUpdated");

  if (currentBmi) currentBmi.textContent = bmiValue.toFixed(1);
  if (currentHeight) currentHeight.textContent = `${height} cm`;
  if (currentWeight) currentWeight.textContent = `${weight} kg`;
  if (lastUpdated) lastUpdated.textContent = formatDate(latest.createdAt);

  updateBMIStatus(bmiValue, bmiStatus, bmiMessage);
}

function getBMIStatus(bmi) {
  if (bmi < 18.5) {
    return {
      text: "Underweight",
      className: "status-underweight",
      message: "Your current BMI is below the normal range.",
    };
  }
  if (bmi < 25) {
    return {
      text: "Normal",
      className: "status-normal",
      message: "Your current BMI is within the normal range.",
    };
  }
  if (bmi < 30) {
    return {
      text: "Overweight",
      className: "status-overweight",
      message: "Your current BMI is above the normal range.",
    };
  }
  return {
    text: "Obese",
    className: "status-obese",
    message: "Your current BMI is in the obese range.",
  };
}

function updateBMIStatus(bmi, statusElement, messageElement) {
  const status = getBMIStatus(bmi);

  if (statusElement) {
    statusElement.textContent = status.text;
    statusElement.className = `status-badge ${status.className}`;
  }

  if (messageElement) {
    messageElement.textContent = status.message;
  }
}

function renderHistory() {
  const historyList = document.getElementById("historyList");
  if (!historyList) return;

  historyList.innerHTML = "";

  if (!dashboard.history.length) {
    historyList.innerHTML = `
      <div class="history-row">
        <span>No records yet</span>
        <span>--</span>
        <span>--</span>
        <span>--</span>
        <span>--</span>
      </div>`;
    return;
  }

  [...dashboard.history].reverse().forEach((record) => {
    const row = document.createElement("div");
    row.className = "history-row";

    const date = formatDate(record.createdAt);
    const bmi = Number(record.bmi);
    const status = getBMIStatus(bmi);

    row.innerHTML = `
      <span>${date}</span>
      <span>${Number(record.height)} cm</span>
      <span>${Number(record.weight)} kg</span>
      <strong>${bmi.toFixed(1)}</strong>
      <span class="status-badge ${status.className}">${status.text}</span>
    `;

    historyList.appendChild(row);
  });
}

function formatDate(dateValue) {
  if (!dateValue) return "Unknown date";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function createBMI(height, weight) {
  try {
    const response = await apiRequest("/bmi/create", {
      method: "POST",
      body: JSON.stringify({ height, weight }),
    });

    if (!response) return;

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Unable to calculate BMI.");
    }

    await loadBMIHistory();
    return data;
  } catch (error) {
    console.error("Create BMI error:", error);
    throw error;
  }
}

function setupBMIForm() {
  const form = document.getElementById("bmiForm");
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const height = Number(form.height.value);
    const weight = Number(form.weight.value);

    if (height <= 0 || weight <= 0) {
      alert("Please enter valid height and weight.");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Calculating...";

    try {
      await createBMI(height, weight);
      form.reset();
    } catch (error) {
      alert(error.message || "Unable to calculate BMI.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Calculate BMI";
    }
  });
}

function setupLogout() {
  const logout = document.getElementById("logoutBtn");
  if (!logout) return;

  logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
}

async function initDashboard() {
  await Promise.all([loadProfile(), loadBMIHistory()]);
  setupBMIForm();
  setupLogout();
}

document.addEventListener("DOMContentLoaded", async () => {
  await initDashboard();
});
