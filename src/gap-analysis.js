document.addEventListener('DOMContentLoaded', () => {
    const analysisResults = document.getElementById('analysis-results');
    const noDataMsg = document.getElementById('no-data-msg');
    const roleStatusContainer = document.getElementById('role-status-container');
    const strengthsList = document.getElementById('strengths-list');
    const gapsList = document.getElementById('gaps-list');
    const improvementSummary = document.getElementById('improvement-summary');
    const loadingOverlay = document.getElementById('loading-overlay');

    const levels = ["None", "Beginner", "Intermediate", "Advanced"];

    async function init() {
        showLoading(true);
        try {
            const response = await fetch('/api/profile/me');
            const result = await response.json();
            
            if (result.success) {
                const profile = result.data;
                const targetRole = profile.targetRole;
                const currentRole = profile.roleOrStudy || profile.currentStatus || 'Not specified';
                const skills = profile.skills || [];
                const assessments = profile.assessments || [];

                // 1. Target Role Handling
                if (!targetRole || targetRole.trim() === "") {
                    showEmptyState("Set a career goal to enable skill gap analysis.", true);
                    return;
                }

                displayTargetRole(targetRole);

                // 2. Assessment Completion Check
                if (skills.length === 0 && assessments.length === 0) {
                    showEmptyState("Complete skill assessment to view your skill gap analysis.", false);
                    return;
                }

                // 3. Run Analysis
                runAnalysis(targetRole, skills, assessments, currentRole);
            } else {

                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error("Analysis Error:", error);
            showEmptyState("Unable to load analysis. Please try again later.", false);
        } finally {
            showLoading(false);
        }
    }

    function displayTargetRole(role) {
        roleStatusContainer.innerHTML = `
            <div class="role-badge">
                <i class="fas fa-bullseye"></i> Target Role: <strong>${role}</strong> (from Profile)
            </div>
        `;
    }

    function showEmptyState(message, showProfileBtn) {
        noDataMsg.style.display = 'block';
        noDataMsg.innerHTML = `
            <i class="fas fa-clipboard-list" style="font-size: 3rem; color: var(--primary-btn); margin-bottom: 20px;"></i>
            <p style="font-size: 1.1rem; margin-bottom: 20px;">${message}</p>
            ${showProfileBtn ? 
                `<button onclick="location.href='profile.html'" class="start">Set Career Goal</button>` : 
                `<button onclick="location.href='assessment.html'" class="start">Go to Assessment</button>`
            }
        `;
        analysisResults.style.display = 'none';
    }

    async function runAnalysis(role, userSkills, userAssessments, currentRole) {
        try {
            const response = await fetch('/api/ai/generate-gap-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentRole: currentRole,
                    targetRole: role,
                    userSkills: userSkills,
                    userAssessments: userAssessments
                })
            });

            const result = await response.json();
            if (result.success && result.data) {
                const { completedLevel, nextLevelTarget, strengths, skillGaps, keyAreasForImprovement, improvementSummary: summaryText } = result.data;
                renderResults(completedLevel, nextLevelTarget, strengths, skillGaps, keyAreasForImprovement, summaryText);
                noDataMsg.style.display = 'none';
                analysisResults.style.display = 'block';
            } else {
                showEmptyState("Failed to generate analysis. Please try again.", false);
            }
        } catch (error) {
            console.error("Gap Analysis AI Error:", error);
            showEmptyState("An error occurred during analysis.", false);
        }
    }

    function renderResults(completed, nextTarget, strengths, gaps, keyAreas, summaryText) {
        // Progression Header
        const milestoneHeader = document.getElementById('milestone-header') || document.createElement('div');
        milestoneHeader.id = 'milestone-header';
        milestoneHeader.className = 'milestone-banner';
        milestoneHeader.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="color: #10b981; margin: 0;"><i class="fas fa-award"></i> ${completed || 'Assessment Milestone'}</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 0.9em;"><strong>Target:</strong> ${nextTarget || 'Next Level'}</p>
                </div>
                <button onclick="location.href='assessment.html'" class="btn" style="background: #10b981; font-size: 0.85em; padding: 8px 15px;">Start Next Assessment</button>
            </div>
        `;
        analysisResults.innerHTML = ''; // Clear previous
        analysisResults.appendChild(milestoneHeader);

        // Render Strengths
        const strengthsHeader = document.createElement('div');
        strengthsHeader.className = 'section-header';
        strengthsHeader.innerHTML = '<i class="fas fa-award"></i><h3>Your Strengths</h3>';
        analysisResults.appendChild(strengthsHeader);
        
        const strengthsContainer = document.createElement('div');
        strengthsContainer.innerHTML = strengths.length > 0 ? '' : '<p class="placeholder-text">No matching strengths found yet.</p>';
        strengths.forEach(s => strengthsContainer.appendChild(createItemCard(s, 'strength')));
        analysisResults.appendChild(strengthsContainer);

        // Render Skill Gaps
        const gapsHeader = document.createElement('div');
        gapsHeader.className = 'section-header';
        gapsHeader.innerHTML = '<i class="fas fa-chart-line"></i><h3>Skill Gaps & Opportunities</h3>';
        analysisResults.appendChild(gapsHeader);

        const gapsContainer = document.createElement('div');
        gapsContainer.innerHTML = gaps.length > 0 ? '' : '<p class="placeholder-text">Great job! You meet all requirements for this role.</p>';
        gaps.forEach(s => {
            const statusType = s.type === 'Missing Skill' ? 'missing' : 'improvement';
            gapsContainer.appendChild(createItemCard(s, statusType));
        });
        analysisResults.appendChild(gapsContainer);

        // Key Areas for Improvement (User Requested Section)
        const improvementHeader = document.createElement('div');
        improvementHeader.className = 'section-header';
        improvementHeader.innerHTML = '<i class="fas fa-tasks"></i><h3>Key Areas for Improvement</h3>';
        analysisResults.appendChild(improvementHeader);

        const improvementContainer = document.createElement('div');
        improvementContainer.className = 'summary-box';
        if (keyAreas && keyAreas.length > 0) {
            let listHtml = '<ul class="priority-list" style="list-style: none; padding: 0;">';
            keyAreas.forEach(area => {
                listHtml += `<li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 10px;">
                    <i class="fas fa-check-circle" style="color: #3b82f6; margin-top: 4px;"></i>
                    <span>${area}</span>
                </li>`;
            });
            listHtml += '</ul>';
            improvementContainer.innerHTML = listHtml;
        } else {
            improvementContainer.innerHTML = '<p class="placeholder-text">Complete more assessments to generate specific improvement areas.</p>';
        }
        analysisResults.appendChild(improvementContainer);

        // Render Improvement Summary
        const summaryHeader = document.createElement('div');
        summaryHeader.className = 'section-header';
        summaryHeader.innerHTML = '<i class="fas fa-lightbulb"></i><h3>Strategic Guidance</h3>';
        analysisResults.appendChild(summaryHeader);

        const summaryBox = document.createElement('div');
        summaryBox.id = 'improvement-summary';
        analysisResults.appendChild(summaryBox);
        generateSummary(gaps, summaryText);

        // Add final Roadmap button
        const roadmapBtnContainer = document.createElement('div');
        roadmapBtnContainer.style.cssText = 'margin-top: 50px; text-align: center;';
        roadmapBtnContainer.innerHTML = '<button onclick="location.href=\'roadmap.html\'" class="start">View Personalized Roadmap</button>';
        analysisResults.appendChild(roadmapBtnContainer);
    }

    function createItemCard(skill, status) {
        const div = document.createElement('div');
        div.className = 'gap-item';
        
        let statusBadge = '';
        let levelInfo = '';

        if (status === 'strength') {
            statusBadge = '<span class="status-badge status-complete">Strength</span>';
            levelInfo = `<span class="level-text">Your Level: ${skill.level} (Meets Target)</span>`;
        } else if (status === 'improvement') {
            statusBadge = '<span class="status-badge status-improvement">Needs Improvement</span>';
            levelInfo = `<span class="level-text">Target: ${skill.target} | Your Level: ${skill.level}</span>`;
        } else {
            statusBadge = '<span class="status-badge status-gap">Missing Skill</span>';
            levelInfo = `<span class="level-text">Target: ${skill.target} | Skill not found</span>`;
        }

        div.innerHTML = `
            <div>
                <strong style="font-size: 1.1rem; color: var(--heading-color);">${skill.name}</strong><br>
                ${levelInfo}
            </div>
            ${statusBadge}
        `;
        return div;
    }

    function generateSummary(gaps, summaryText) {
        if (gaps.length === 0) {
            improvementSummary.innerHTML = `
                <div class="summary-box success">
                    <p><strong>Perfect Match!</strong> ${summaryText || 'You have all the core skills required for your target role. Focus on deepening your expertise in your existing strengths.'}</p>
                </div>
            `;
            return;
        }

        let summaryHtml = `
            <div class="summary-box">
                <p>${summaryText || 'To reach your goal, you should focus on improving your key areas. We recommend starting with the missing foundational skills before advancing your proficiency in existing ones.'}</p>
                <h4 style="margin: 20px 0 10px 0; color: var(--accent);">Priority Order:</h4>
                <ol class="priority-list">
        `;

        // Filter out types for the list and show them as priority items
        gaps.forEach((item) => {
            const typeLabel = item.type === 'Missing Skill' ? 'Missing' : 'Needs Improvement';
            summaryHtml += `<li><strong>${item.name}</strong> (${typeLabel})</li>`;
        });

        summaryHtml += `
                </ol>
            </div>
        `;
        improvementSummary.innerHTML = summaryHtml;
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
