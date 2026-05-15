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
            if (document.getElementById('skills-empty-state')) document.getElementById('skills-empty-state').style.display = 'none';
            if (document.getElementById('education-empty-state')) document.getElementById('education-empty-state').style.display = 'none';
        } else {
            viewElements.forEach(el => {
                if (el.id !== 'skills-empty-state' && el.id !== 'education-empty-state') el.style.display = 'block';
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
        document.getElementById('sidebarStatus').textContent = profile.jobTitle || profile.targetRole || 'Role Not Set';
        profileAvatar.src = profile.avatar || '/profileplaceHolder.jfif';
        if (headerAvatar) headerAvatar.src = profile.avatar || '/profileplaceHolder.jfif';
        document.getElementById('headerUserName').textContent = fullName.split(' ')[0];

        setTextContent('view-fullname', fullName, 'Enter your full name');
        setTextContent('view-email', profile.userEmail, 'email@example.com');
        setTextContent('view-mobileNumber', profile.mobileNumber, 'Not provided');
        setTextContent('view-gender', profile.gender, 'Gender not provided');
        setTextContent('view-dob', profile.dob ? new Date(profile.dob).toLocaleDateString() : '', 'Date of birth not provided');
        setTextContent('view-nationality', profile.nationality, 'Nationality not provided');
        setTextContent('view-secondaryEmail', profile.secondaryEmail, 'Not provided');
        setTextContent('view-residentialAddress', profile.residentialAddress, 'Address not provided');
        
        // Unified Career Status
        setTextContent('view-currentStatus', profile.currentStatus, 'Beginner');
        setTextContent('view-roleOrStudy', profile.roleOrStudy, 'Provide role or area of study');
        setTextContent('view-targetRole', profile.jobTitle || profile.targetRole, 'Select your career goal');
        setTextContent('view-department', profile.department, 'Product & Design');
        setTextContent('view-reportingManager', profile.reportingManager, 'Manager Name');
        setTextContent('view-employmentType', profile.employmentType, 'Permanent');
        setTextContent('view-joiningDate', profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : '', 'mm/dd/yyyy');
        setTextContent('view-workLocation', profile.workLocation, 'Seattle, WA');
        setTextContent('view-totalExperience', profile.totalExperience, '0');

        // Compliance & Docs (Read-only)
        setTextContent('view-govtIdType', profile.govtIdType, 'Not verified');
        setTextContent('view-idNumber', profile.idNumber ? '********' : '', 'Not provided'); // Mask sensitive info
        setTextContent('view-nationalId', profile.nationalId ? '********' : '', 'Not provided');
        setTextContent('view-workAuthorization', profile.workAuthorization, 'Not provided');
        
        const bgStatus = document.getElementById('view-bgVerificationStatus');
        if (bgStatus) {
            bgStatus.textContent = profile.backgroundVerificationStatus || 'Not Started';
            bgStatus.className = `badge ${profile.backgroundVerificationStatus === 'Verified' ? 'verified' : ''}`;
        }

        // System Information
        const user = profile.userId || {};
        const sysUserId = document.getElementById('sysUserId');
        const sysCreatedDate = document.getElementById('sysCreatedDate');
        const sysUpdatedDate = document.getElementById('sysUpdatedDate');
        const sysUserRole = document.getElementById('sysUserRole');

        if (sysUserId) sysUserId.textContent = user.fullname || user.username || '--';
        if (sysCreatedDate) sysCreatedDate.textContent = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '--';
        if (sysUpdatedDate) sysUpdatedDate.textContent = profile.lastProfileUpdated ? new Date(profile.lastProfileUpdated).toLocaleDateString() : '--';
        if (sysUserRole) sysUserRole.textContent = user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Standard User';

        if (document.getElementById('skills-empty-state')) {
            const skillsEmpty = !profile.skills || profile.skills.length === 0;
            document.getElementById('skills-empty-state').style.display = (!isEditMode && skillsEmpty) ? 'block' : 'none';
        }

        // Format Dates for Input (YYYY-MM-DD)
        const formattedDob = profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : '';
        const formattedJoiningDate = profile.joiningDate ? new Date(profile.joiningDate).toISOString().split('T')[0] : '';
        
        populateForm('basicInfoForm', { 
            fullname: fullName, 
            email: profile.userEmail, 
            mobileNumber: profile.mobileNumber,
            gender: profile.gender,
            dob: formattedDob,
            nationality: profile.nationality,
            secondaryEmail: profile.secondaryEmail,
            residentialAddress: profile.residentialAddress
        });
        
        populateForm('careerForm', {
            currentStatus: profile.currentStatus,
            roleOrStudy: profile.roleOrStudy,
            targetRole: profile.jobTitle || profile.targetRole,
            department: profile.department,
            reportingManager: profile.reportingManager,
            employmentType: profile.employmentType,
            joiningDate: formattedJoiningDate,
            workLocation: profile.workLocation,
            totalExperience: profile.totalExperience
        });

        renderSkills(profile.skills);
        renderEducation(profile.education);
        updateCompletionStatus(profile);
    };

    const renderEducation = (education = []) => {
        const list = document.getElementById('education-list');
        const editList = document.getElementById('education-edit-list');
        const emptyState = document.getElementById('education-empty-state');
        
        if (!list || !editList) return;

        list.innerHTML = '';
        editList.innerHTML = '';
        
        if (education.length === 0) {
            if (!isEditMode) emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';

        education.forEach((edu, index) => {
            // View item
            const viewItem = document.createElement('div');
            viewItem.className = 'cta-box mt-2';
            viewItem.style.textAlign = 'left';
            viewItem.innerHTML = `
                <h4 style="color:var(--primary-color)">${edu.degree}</h4>
                <p><strong>${edu.institution}</strong> | ${edu.university}</p>
                <p class="text-secondary">${edu.graduationYear} • Grade: ${edu.grade}</p>
            `;
            list.appendChild(viewItem);

            // Edit item
            const editItem = document.createElement('div');
            editItem.className = 'skill-entry-row mt-2';
            editItem.style.display = 'flex';
            editItem.style.justifyContent = 'space-between';
            editItem.style.alignItems = 'center';
            editItem.innerHTML = `
                <div>
                    <strong>${edu.degree}</strong> at ${edu.institution} (${edu.graduationYear})
                </div>
                <button type="button" class="btn btn-danger-link" onclick="removeEducation(${index})">
                    <i class="fas fa-trash-alt"></i> Remove
                </button>
            `;
            editList.appendChild(editItem);
        });
    };

    const addEducationBtn = document.getElementById('addEducationBtn');
    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', () => {
            const form = document.getElementById('newEducationForm');
            const formData = new FormData(form);
            const degree = formData.get('degree');
            const institution = formData.get('institution');
            
            if (degree && institution) {
                const newEdu = {
                    degree,
                    institution,
                    university: formData.get('university'),
                    graduationYear: parseInt(formData.get('graduationYear')),
                    grade: formData.get('grade')
                };
                
                if (!currentProfile.education) currentProfile.education = [];
                currentProfile.education.push(newEdu);
                renderEducation(currentProfile.education);
                form.reset();
            } else showToast('Degree and Institution are required', 'warning');
        });
    }

    window.removeEducation = (index) => {
        currentProfile.education.splice(index, 1);
        renderEducation(currentProfile.education);
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

        if (profile.currentStatus && (profile.jobTitle || profile.targetRole)) percentage += 30;
        else missingSteps.push('Complete Career Status');

        if (profile.skills && profile.skills.length > 0) percentage += 40;
        else missingSteps.push('Add at least one skill');

        completionText.textContent = `${percentage}%`;
        completionCircle.style.strokeDasharray = `${percentage}, 100`;

        const isComplete = percentage === 100;
        badge.textContent = isComplete ? 'Complete' : 'Incomplete';
        badge.className = `badge ${isComplete ? 'verified' : ''}`;
        
        hint.textContent = isComplete ? 'Great! Your profile is complete.' : 'Complete your profile to unlock full features.';
        hint.style.color = isComplete ? '#10b981' : '';
        
        const careerComplete = profile.currentStatus && (profile.jobTitle || profile.targetRole);
        if (fullName && careerComplete) navAssessment.classList.remove('disabled-nav');
        else navAssessment.classList.add('disabled-nav');

        const hasCareerData = (profile.skills && profile.skills.length > 0) || (profile.assessments && profile.assessments.length > 0);
        if (hasCareerData) navGapAnalysis.classList.remove('disabled-nav');
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
        
        const combinedUpdates = { 
            ...basicData, 
            ...careerData, 
            jobTitle: careerData.targetRole, 
            skills: currentProfile.skills,
            education: currentProfile.education || []
        };

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
