function goDashboard() {
  window.location.href = "dashboard.html";
}

function goHome() {
  window.location.href = "dashboard.html";
}

function goProfile() {
  window.location.href = "../profile.html";
}

function goAssessment() {
  window.location.href = "../assessment.html";
}

function goRoadmap() {
  window.location.href = "../roadmap.html";
}

function goGapAnalysis() {
  window.location.href = "../gap-analysis.html";
}

document.addEventListener('DOMContentLoaded', () => {
    // Theme logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const updateThemeUI = (isDark) => {
        body.classList.toggle('dark-mode', isDark);
        if (themeToggle) {
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    };

    const savedTheme = localStorage.getItem('theme');
    updateThemeUI(savedTheme === 'dark');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = body.classList.contains('dark-mode');
            const newTheme = !isDark;
            localStorage.setItem('theme', newTheme ? 'dark' : 'light');
            updateThemeUI(newTheme);
        });
    }

    // Route Guard: Protect Dashboard
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '../index.html';
        return;
    }

    // Logout logic
    const logoutBtns = document.querySelectorAll('.logout-btn, .logout');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = '../index.html';
        });
    });

    // Display username
    if (user && (user.username || user.fullname)) {
        const welcomeSpan = document.querySelector('.user-actions span');
        const displayName = user.fullname || user.username;
        if (welcomeSpan) welcomeSpan.innerText = `Welcome, ${displayName}`;
    }

    // Update Status Cards from API
    const fetchStats = async () => {
        try {
            const response = await fetch('/api/profile/me');
            const result = await response.json();
            if (result.success) {
                const profile = result.data;
                const statusCards = document.querySelectorAll('.status-card');
                
                // Get display name from profile population if possible
                const profileUser = profile.userId || {};
                const fullName = profileUser.fullname || user.fullname || user.username;
                const welcomeSpan = document.querySelector('.user-actions span');
                if (welcomeSpan) welcomeSpan.innerText = `Welcome, ${fullName}`;

                if (statusCards.length >= 3) {
                    // 1. Profile Status Card
                    const statusText = profile.profileStatus || 'Incomplete';
                    statusCards[0].querySelector('p').innerText = statusText;
                    statusCards[0].querySelector('p').style.color = (statusText === 'Complete') ? '#10b981' : '#ef4444';
                    
                    // 2. Skills Assessed Card -> Mapped to total number of skills added
                    const skillsAddedCount = profile.skills ? profile.skills.length : 0;
                    statusCards[1].querySelector('p').innerText = `${skillsAddedCount} Skills Added`;
                    
                    // 3. Target Role Card
                    statusCards[2].querySelector('p').innerText = profile.targetRole || 'Not Selected';
                }

                // Feature Access Control from Dashboard
                // Skill Assessment enabled only after Career Status is complete
                const careerComplete = profile.currentStatus && profile.roleOrStudy && profile.roleOrStudy.trim() !== "";
                const assessmentBtn = document.querySelector('.action-card:nth-child(2) button');
                if (assessmentBtn) {
                    if (!careerComplete) {
                        assessmentBtn.disabled = true;
                        assessmentBtn.style.opacity = '0.5';
                        assessmentBtn.title = "Complete Career Status to unlock assessment";
                        assessmentBtn.parentElement.classList.add('disabled-card');
                    }
                }

                // Gap Analysis & Roadmap enabled only when skills exist
                const skillsComplete = profile.skills && profile.skills.length > 0;
                const roadmapBtn = document.querySelector('.action-card:nth-child(3) button');
                if (roadmapBtn) {
                    if (!skillsComplete) {
                        roadmapBtn.disabled = true;
                        roadmapBtn.style.opacity = '0.5';
                        roadmapBtn.title = "Add at least one skill to unlock roadmap";
                        roadmapBtn.parentElement.classList.add('disabled-card');
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch profile stats:", error);
        }
    };

    fetchStats();
});
