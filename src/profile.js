document.addEventListener('DOMContentLoaded', () => {
    // State management
    let currentProfile = null;
    let isEditMode = false;

    // UI Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const editToggleBtns = document.querySelectorAll('.edit-toggle-btn');
    const globalFormActions = document.getElementById('globalFormActions');
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    const cancelChangesBtn = document.getElementById('cancelChangesBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const navAssessment = document.getElementById('navAssessment');
    const navGapAnalysis = document.getElementById('navGapAnalysis');
    
    // Avatar Elements
    const avatarUploadTrigger = document.getElementById('avatarUploadTrigger');
    const avatarInput = document.getElementById('avatarInput');
    const profileAvatar = document.getElementById('profileAvatar');
    const headerAvatar = document.getElementById('headerAvatar');

    // --- Avatar Upload Logic ---
    if (avatarUploadTrigger) {
        avatarUploadTrigger.addEventListener('click', () => avatarInput.click());
    }

    if (avatarInput) {
        avatarInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file || !file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64Image = event.target.result;
                try {
                    const response = await fetch('/api/profile/avatar', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ avatarUrl: base64Image })
                    });
                    const result = await response.json();
                    if (result.success) {
                        profileAvatar.src = base64Image;
                        if (headerAvatar) headerAvatar.src = base64Image;
                        showToast('Avatar updated successfully', 'success');
                    }
                } catch (error) { console.error('Upload Error:', error); }
            };
            reader.readAsDataURL(file);
        });
    }

    // --- Tab Switching ---
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            updateModeDisplay();
        });
    });

    // --- Mode Management ---
    const updateModeDisplay = () => {
        const viewElements = document.querySelectorAll('.view-mode');
        const editElements = document.querySelectorAll('.edit-mode');
        
        if (isEditMode) {
            viewElements.forEach(el => el.style.display = 'none');
            editElements.forEach(el => {
                if (el.tagName === 'DIV' || el.tagName === 'FORM' || el.classList.contains('form-footer-actions')) el.style.display = 'flex';
                else if (el.classList.contains('grid-form')) el.style.display = 'grid';
                else el.style.display = 'block';
            });
            if (document.getElementById('career-empty-state')) document.getElementById('career-empty-state').style.display = 'none';
            if (document.getElementById('skills-empty-state')) document.getElementById('skills-empty-state').style.display = 'none';
        } else {
            viewElements.forEach(el => {
                if (el.id !== 'career-empty-state' && el.id !== 'skills-empty-state') el.style.display = 'block';
            });
            editElements.forEach(el => el.style.display = 'none');
            if (currentProfile) renderProfile(currentProfile);
        }
    };

    const setEditMode = (enabled) => {
        isEditMode = enabled;
        updateModeDisplay();
    };

    editToggleBtns.forEach(btn => btn.addEventListener('click', () => setEditMode(true)));
    cancelChangesBtn.addEventListener('click', () => {
        setEditMode(false);
        renderProfile(currentProfile);
    });

    // --- Fetch Profile Data ---
    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/profile/me');
            const result = await response.json();
            if (result.success) {
                currentProfile = result.data;
                renderProfile(currentProfile);
            } else if (response.status === 401) window.location.href = 'index.html';
        } catch (error) { console.error('Fetch Error:', error); }
    };

    // --- Render Profile to UI ---
    const renderProfile = (profile) => {
        if (!profile) return;

        const fullName = profile.userName || 'New User';
        document.getElementById('sidebarFullName').textContent = fullName;
        document.getElementById('sidebarStatus').textContent = profile.currentStatus || 'Status Not Set';
        profileAvatar.src = profile.avatar || '/profileplaceHolder.jfif';
        if (headerAvatar) headerAvatar.src = profile.avatar || '/profileplaceHolder.jfif';
        document.getElementById('headerUserName').textContent = fullName.split(' ')[0];

        setTextContent('view-fullname', fullName, 'Enter your full name');
        setTextContent('view-email', profile.userEmail, 'email@example.com');
        setTextContent('view-age', profile.age, 'Age not provided');
        setTextContent('view-gender', profile.gender, 'Gender not provided');
        setTextContent('view-mobileNumber', profile.mobileNumber, 'Not provided');
        
        setTextContent('view-currentStatus', profile.currentStatus, 'Provide career status');
        setTextContent('view-roleOrStudy', profile.roleOrStudy, 'Provide role or area of study');
        setTextContent('view-totalExperience', profile.totalExperience, '0');
        
        setTextContent('view-targetGoal', profile.targetRole, 'No target role selected');

        if (document.getElementById('career-empty-state')) {
            const careerEmpty = !profile.currentStatus && !profile.roleOrStudy;
            document.getElementById('career-empty-state').style.display = (!isEditMode && careerEmpty) ? 'block' : 'none';
            document.getElementById('careerForm').style.display = (careerEmpty && !isEditMode) ? 'none' : 'grid';
        }

        if (document.getElementById('skills-empty-state')) {
            const skillsEmpty = !profile.skills || profile.skills.length === 0;
            document.getElementById('skills-empty-state').style.display = (!isEditMode && skillsEmpty) ? 'block' : 'none';
        }

        populateForm('basicInfoForm', { fullname: fullName, email: profile.userEmail, age: profile.age, gender: profile.gender, mobileNumber: profile.mobileNumber });
        populateForm('careerForm', profile);
        populateForm('goalsForm', { targetGoal: profile.targetRole });

        renderSkills(profile.skills);
        updateCompletionStatus(profile);
    };

    const setTextContent = (id, value, placeholder) => {
        const el = document.getElementById(id);
        if (!el) return;
        const hasValue = value !== null && value !== undefined && value.toString().trim() !== "";
        el.textContent = hasValue ? value : placeholder;
        el.classList.toggle('placeholder-text', !hasValue);
    };

    const populateForm = (formId, data) => {
        const form = document.getElementById(formId);
        if (!form) return;
        form.querySelectorAll('input, select, textarea').forEach(input => {
            const name = input.getAttribute('name');
            input.value = (data[name] !== undefined && data[name] !== null) ? data[name] : '';
        });
    };

    const renderSkills = (skills) => {
        const container = document.getElementById('skillsTags');
        if (!container) return;
        container.innerHTML = '';
        if (skills && skills.length > 0) {
            skills.forEach(skillObj => {
                const skillName = typeof skillObj === 'string' ? skillObj : skillObj.name;
                const proficiency = typeof skillObj === 'string' ? 'Intermediate' : skillObj.proficiency;
                const tag = document.createElement('div');
                tag.className = 'tag';
                tag.style.padding = '8px 14px';
                tag.innerHTML = `
                    <div style="display:flex; flex-direction:column; line-height:1.2;">
                        <span style="font-weight:600;">${skillName}</span>
                        <span style="font-size:0.75rem; opacity:0.8;">${proficiency}</span>
                    </div>
                    ${isEditMode ? `<i class="fas fa-times" style="margin-left:10px; cursor:pointer;" onclick="removeSkill('${skillName}')"></i>` : ''}
                `;
                container.appendChild(tag);
            });
        } else if (!isEditMode) container.innerHTML = '<p class="placeholder-text">No skills added yet.</p>';
    };

    const updateCompletionStatus = (profile) => {
        const list = document.getElementById('nextStepsList');
        const badge = document.getElementById('profileStatusBadge');
        const hint = document.getElementById('completionHint');
        const completionText = document.getElementById('completionText');
        const completionCircle = document.getElementById('completionCircle');
        if (!list) return;

        list.innerHTML = '';
        let percentage = 0;
        const missingSteps = [];
        const fullName = profile.userName;

        if (fullName && fullName.trim() !== "") percentage += 30;
        else missingSteps.push('Set your Full Name');

        if (profile.currentStatus && profile.roleOrStudy && profile.roleOrStudy.trim() !== "") percentage += 30;
        else missingSteps.push('Complete Career Status');

        if (profile.skills && profile.skills.length > 0) percentage += 40;
        else missingSteps.push('Add at least one skill');

        completionText.textContent = `${percentage}%`;
        completionCircle.style.strokeDasharray = `${percentage}, 100`;

        const isComplete = percentage === 100;
        badge.textContent = isComplete ? 'Complete' : 'Incomplete';
        badge.className = `badge ${isComplete ? 'verified' : ''}`;
        if (!isComplete) {
            badge.style.backgroundColor = '#fed9cc';
            badge.style.color = '#ef4444';
        } else {
            badge.style.backgroundColor = ''; badge.style.color = '';
        }
        
        hint.textContent = isComplete ? 'Great! Your profile is complete.' : 'Complete your profile to unlock full features.';
        hint.style.color = isComplete ? '#10b981' : '';
        
        const careerComplete = profile.currentStatus && profile.roleOrStudy && profile.roleOrStudy.trim() !== "";
        if (fullName && careerComplete) navAssessment.classList.remove('disabled-nav');
        else navAssessment.classList.add('disabled-nav');

        if (profile.skills && profile.skills.length > 0) navGapAnalysis.classList.remove('disabled-nav');
        else navGapAnalysis.classList.add('disabled-nav');

        missingSteps.forEach(step => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${step}`;
            list.appendChild(li);
        });
    };

    saveChangesBtn.addEventListener('click', async () => {
        const basicData = getFormData('basicInfoForm');
        const careerData = getFormData('careerForm');
        const goalsData = getFormData('goalsForm');
        const combinedUpdates = { ...basicData, ...careerData, ...goalsData, skills: currentProfile.skills };

        try {
            const response = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(combinedUpdates)
            });
            const result = await response.json();
            if (result.success) {
                currentProfile = result.data;
                setEditMode(false);
                renderProfile(currentProfile);
                showToast('Profile updated successfully', 'success');
            } else showToast(result.message || 'Update failed', 'danger');
        } catch (error) { console.error('Update Error:', error); }
    });

    const getFormData = (formId) => {
        const form = document.getElementById(formId);
        const data = {};
        if (!form) return data;
        form.querySelectorAll('input:not(.readonly-field), select:not(.readonly-field), textarea:not(.readonly-field)').forEach(input => {
            if (input.name) data[input.name] = input.value;
        });
        return data;
    };

    const addSkillBtn = document.getElementById('addSkillBtn');
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', () => {
            const skillName = document.getElementById('skillInput').value.trim();
            const proficiency = document.getElementById('proficiencyInput').value;
            if (skillName) {
                if (!currentProfile.skills.some(s => (typeof s === 'string' ? s : s.name).toLowerCase() === skillName.toLowerCase())) {
                    currentProfile.skills.push({ name: skillName, proficiency: proficiency });
                    renderSkills(currentProfile.skills);
                    document.getElementById('skillInput').value = '';
                } else showToast('Skill already added', 'warning');
            }
        });
    }

    window.removeSkill = (skillName) => {
        currentProfile.skills = currentProfile.skills.filter(s => (typeof s === 'string' ? s : s.name) !== skillName);
        renderSkills(currentProfile.skills);
    };

    const showToast = (message, type = 'primary') => {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> <span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    };

    fetchProfile();
});
