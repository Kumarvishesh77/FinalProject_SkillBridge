document.addEventListener('DOMContentLoaded', () => {
    // Version: 2.0 (Dynamic Full View Implementation)
    console.log("[SkillBridge] Gap Analysis Module v2.0 Initializing...");

    const analysisResults = document.getElementById('analysis-results');
    const noDataMsg = document.getElementById('no-data-msg');
    const roleStatusContainer = document.getElementById('role-status-container');
    const loadingOverlay = document.getElementById('loading-overlay');

    async function init() {
        console.log("[SkillBridge] Fetching profile data...");
        showLoading(true);
        try {
            const response = await fetch('/api/profile/me');
            const result = await response.json();
            
            if (result.success) {
                const profile = result.data;
                const targetRole = profile.jobTitle || profile.targetRole;
                const company = profile.organizationName;

                console.log("[SkillBridge] Profile Context:", { targetRole, company });

                // 1. Target Role Handling: Only show empty state if NO career goal is set
                if (!targetRole || targetRole.trim() === "") {
                    console.warn("[SkillBridge] No career goal found. Displaying empty state.");
                    showEmptyState("Set a career goal in your profile to enable skill gap analysis.", true);
                    return;
                }

                // 2. Clear empty state and prepare UI for full view
                noDataMsg.style.display = 'none';
                analysisResults.style.display = 'block';
                displayTargetRole(targetRole, company);

                // 3. Force Full Analysis Run
                console.log("[SkillBridge] Triggering dynamic analysis...");
                runAnalysis(profile);
            } else {
                console.error("[SkillBridge] Failed to fetch profile. Redirecting...");
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error("[SkillBridge] Analysis Init Error:", error);
            showEmptyState("Unable to load analysis. Please check your connection.", false);
        } finally {
            showLoading(false);
        }
    }

    async function runAnalysis(profile) {
        showLoading(true);
        try {
            const analysisRequest = {
                currentRole: profile.currentStatus,
                targetRole: profile.jobTitle || profile.targetRole,
                userSkills: profile.skills,
                userAssessments: profile.assessments,
                company: profile.organizationName
            };

            const response = await fetch('/api/ai/generate-gap-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(analysisRequest)
            });

            const result = await response.json();
            console.log("[SkillBridge] Analysis API Response:", result);

            if (result.success && result.data) {
                const { completedLevel, nextLevelTarget, strengths, skillGaps, keyAreasForImprovement, improvementSummary } = result.data;
                
                // Hide any lingering empty state
                noDataMsg.style.display = 'none';
                analysisResults.style.display = 'block';

                renderResults(completedLevel, nextLevelTarget, strengths, skillGaps, keyAreasForImprovement, improvementSummary);
            } else {
                showEmptyState(result.message || "Failed to generate dynamic analysis.", false);
            }
        } catch (error) {
            console.error("[SkillBridge] Analysis AI Error:", error);
            showEmptyState("An error occurred during dynamic generation.", false);
        } finally {
            showLoading(false);
        }
    }

    function displayTargetRole(role, company) {
        const companyText = company ? ` at <strong>${company}</strong>` : '';
        roleStatusContainer.innerHTML = `
            <div class="role-badge">
                <i class="fas fa-bullseye"></i> Target: <strong>${role}</strong>${companyText}
            </div>
            <p style="font-size: 0.9em; opacity: 0.8; margin-top: 10px; color: var(--heading-color);">
                <i class="fas fa-magic"></i> Live AI analysis based on your latest Profile and Assessments.
            </p>
        `;
    }

    function showEmptyState(message, showProfileBtn) {
        noDataMsg.style.display = 'block';
        analysisResults.style.display = 'none';
        noDataMsg.innerHTML = `
            <i class="fas fa-clipboard-list" style="font-size: 3rem; color: var(--primary-btn); margin-bottom: 20px;"></i>
            <p style="font-size: 1.1rem; margin-bottom: 20px;">${message}</p>
            ${showProfileBtn ? 
                `<button onclick="location.href='profile.html'" class="start">Set Career Goal</button>` : 
                `<button onclick="location.href='assessment.html'" class="start">Go to Assessment</button>`
            }
        `;
    }

    function renderResults(completed, nextTarget, strengths, gaps, keyAreas, summaryText) {
        analysisResults.innerHTML = ''; // Clear for fresh render

        // Milestone Progress Banner
        const milestoneDiv = document.createElement('div');
        milestoneDiv.className = 'milestone-banner';
        milestoneDiv.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; padding: 20px; border-radius: 12px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; backdrop-filter: blur(10px);">
                <div>
                    <h3 style="color: #10b981; margin: 0; font-size: 1.4em;"><i class="fas fa-award"></i> ${completed || 'Assessment Phase Active'}</h3>
                    <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 1em;"><strong>Upcoming Milestone:</strong> ${nextTarget || 'Mastery Path'}</p>
                </div>
                <button onclick="location.href='assessment.html'" class="btn" style="background: #10b981; font-size: 0.9em; padding: 10px 20px; border-radius: 8px;">Start Next Level</button>
            </div>
        `;
        analysisResults.appendChild(milestoneDiv);

        // Render Strengths Section
        const strengthsSection = document.createElement('div');
        strengthsSection.innerHTML = `
            <div class="section-header">
                <i class="fas fa-check-circle" style="color: #10b981"></i>
                <h3>Verified Strengths</h3>
            </div>
            <div id="strengths-container"></div>
        `;
        analysisResults.appendChild(strengthsSection);
        const strengthsContainer = strengthsSection.querySelector('#strengths-container');
        
        if (strengths && strengths.length > 0) {
            strengths.forEach(s => strengthsContainer.appendChild(createItemCard(s, 'strength')));
        } else {
            strengthsContainer.innerHTML = '<p class="placeholder-text">Complete assessments to see your verified strengths here.</p>';
        }

        // Render Gaps Section
        const gapsSection = document.createElement('div');
        gapsSection.innerHTML = `
            <div class="section-header">
                <i class="fas fa-exclamation-triangle" style="color: #f59e0b"></i>
                <h3>Skill Gaps & Opportunities</h3>
            </div>
            <div id="gaps-container"></div>
        `;
        analysisResults.appendChild(gapsSection);
        const gapsContainer = gapsSection.querySelector('#gaps-container');

        if (gaps && gaps.length > 0) {
            gaps.forEach(s => {
                const statusType = s.type === 'Missing Skill' ? 'missing' : 'improvement';
                gapsContainer.appendChild(createItemCard(s, statusType));
            });
        } else {
            gapsContainer.innerHTML = '<p class="placeholder-text">Checking for skill requirements...</p>';
        }

        // Key Areas for Improvement Section
        const improvementSection = document.createElement('div');
        improvementSection.innerHTML = `
            <div class="section-header">
                <i class="fas fa-list-ol" style="color: var(--primary-btn)"></i>
                <h3>Focus Areas for ${nextTarget || 'Growth'}</h3>
            </div>
            <div class="summary-box">
                <ul id="improvement-areas-list" class="priority-list" style="list-style: none; padding: 0;"></ul>
            </div>
        `;
        analysisResults.appendChild(improvementSection);
        const areasList = improvementSection.querySelector('#improvement-areas-list');

        if (keyAreas && keyAreas.length > 0) {
            keyAreas.forEach(area => {
                const li = document.createElement('li');
                li.style.cssText = 'margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;';
                li.innerHTML = `<i class="fas fa-arrow-right" style="color: var(--primary-btn); margin-top: 5px; font-size: 0.8em;"></i><span>${area}</span>`;
                areasList.appendChild(li);
            });
        } else {
            areasList.innerHTML = '<li class="placeholder-text">Define specific learning paths via assessment results.</li>';
        }

        // Strategic Guidance Section
        const guidanceSection = document.createElement('div');
        guidanceSection.innerHTML = `
            <div class="section-header">
                <i class="fas fa-lightbulb" style="color: #ef4444"></i>
                <h3>Strategic Guidance</h3>
            </div>
            <div class="summary-box">
                <p id="strategic-text" style="font-weight: 500;"></p>
            </div>
        `;
        analysisResults.appendChild(guidanceSection);
        guidanceSection.querySelector('#strategic-text').innerText = summaryText || "Analyze your skill gaps to formulate a targeted learning strategy.";

        // Action Button
        const actionsDiv = document.createElement('div');
        actionsDiv.style.cssText = 'margin-top: 50px; text-align: center;';
        actionsDiv.innerHTML = `<button onclick="location.href='roadmap.html'" class="start" style="padding: 15px 40px; font-size: 1.1rem;">Build My Learning Roadmap</button>`;
        analysisResults.appendChild(actionsDiv);
    }

    function createItemCard(skill, status) {
        const div = document.createElement('div');
        div.className = 'gap-item';
        
        let statusBadge = '';
        let levelInfo = '';
        const priorityBadge = skill.priority && skill.priority.includes('High') 
            ? `<span style="font-size: 0.7em; background: #fee2e2; color: #b91c1c; padding: 2px 8px; border-radius: 4px; margin-left: 10px; border: 1px solid #fca5a5;"><i class="fas fa-exclamation-circle"></i> ${skill.priority}</span>`
            : '';

        if (status === 'strength') {
            statusBadge = '<span class="status-badge status-complete">Verified Strength</span>';
            levelInfo = `<span class="level-text">Proficiency: <strong>${skill.level}</strong> (Meets Requirement)</span>`;
        } else if (status === 'improvement') {
            statusBadge = '<span class="status-badge status-improvement">Improvement Needed</span>';
            levelInfo = `<span class="level-text">Target: <strong>${skill.target}</strong> | Current: <strong>${skill.level}</strong></span>`;
        } else {
            statusBadge = '<span class="status-badge status-gap">Missing Skill</span>';
            levelInfo = `<span class="level-text">Target Milestone: <strong>${skill.target}</strong></span>`;
        }

        div.innerHTML = `
            <div>
                <strong style="font-size: 1.1rem; color: var(--heading-color);">${skill.name}</strong>${priorityBadge}<br>
                ${levelInfo}
            </div>
            ${statusBadge}
        `;
        return div;
    }

    function showLoading(show) {
        if (loadingOverlay) loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    init();
});

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}
