// نظام إدارة عقود الاعتماد الأكاديمي - النسخة الحكومية النهائية
// تاريخ: 2025-12-09

document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    populateFilters();
    renderAllContracts();
    setupEventListeners();
});

// تهيئة التبويبات
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // إزالة الفئة النشطة من جميع الأزرار والمحتويات
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // إضافة الفئة النشطة للزر والمحتوى المحدد
            this.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
}

// تصنيف العقود حسب حالة الجدولة
function categorizeContracts() {
    const scheduled = [];
    const notScheduled = [];
    const undefined = [];

    contractsData.forEach(contract => {
        const status = contract.visitComplianceStatus || '';
        
        // لم تتم الجدولة - متأخر (البحث عن "لم تتم جدولة" و "متاخر" بدون همزة)
        if (status.includes('لم تتم جدولة') && status.includes('متاخر')) {
            notScheduled.push(contract);
        }
        // تم جدولة الزيارة (أي حالة تحتوي على "تم جدولة الزيارة")
        else if (status.includes('تم جدولة الزيارة') || status.includes('جدولة الزيارة')) {
            scheduled.push(contract);
        }
        // غير محددة (فارغة أو بدون حالة)
        else {
            undefined.push(contract);
        }
    });

    return { scheduled, notScheduled, undefined };
}

// عرض جميع العقود
function renderAllContracts() {
    const { scheduled, notScheduled, undefined } = categorizeContracts();
    
    renderContracts('scheduled', scheduled);
    renderContracts('not-scheduled', notScheduled);
    renderContracts('undefined', undefined);
}

// عرض العقود في التبويب المحدد
function renderContracts(tabName, contracts) {
    const container = document.getElementById('contracts-' + tabName);
    const countElement = document.getElementById('count-' + tabName);
    
    if (countElement) {
        countElement.textContent = contracts.length;
    }
    
    if (!container) return;
    
    container.innerHTML = contracts.map(contract => createContractCard(contract)).join('');
}

// إنشاء بطاقة عقد
function createContractCard(contract) {
    const statusClass = getStatusClass(contract.status);
    const progressClass = getProgressClass(contract.progress);
    
    return `
        <div class="contract-card">
            <div class="contract-header">
                <div class="contract-id">
                    <span class="id-label">رقم العقد:</span>
                    <span class="id-number">#${contract.id}</span>
                </div>
                <div class="contract-status ${statusClass}">
                    ${contract.status || 'غير محدد'}
                </div>
            </div>
            
            <div class="contract-body">
                <div class="contract-row">
                    <div class="field-group">
                        <span class="field-icon">🏛️</span>
                        <div class="field-content">
                            <label class="field-label">الجامعة</label>
                            <p class="field-value">${contract.university || 'غير محدد'}</p>
                        </div>
                    </div>
                </div>

                <div class="contract-row">
                    <div class="field-group">
                        <span class="field-icon">📋</span>
                        <div class="field-content">
                            <label class="field-label">الإدارة</label>
                            <p class="field-value">${contract.department || 'غير محدد'}</p>
                        </div>
                    </div>
                </div>

                <div class="contract-row">
                    <div class="field-group">
                        <span class="field-icon">📚</span>
                        <div class="field-content">
                            <label class="field-label">البرنامج</label>
                            <p class="field-value">${contract.program || 'غير محدد'}</p>
                        </div>
                    </div>
                </div>

                <div class="contract-row-split">
                    <div class="field-group">
                        <span class="field-icon">🎓</span>
                        <div class="field-content">
                            <label class="field-label">الدرجة العلمية</label>
                            <p class="field-value">${contract.degree || 'غير محدد'}</p>
                        </div>
                    </div>
                    
                    <div class="field-group ${progressClass}">
                        <span class="field-icon">📊</span>
                        <div class="field-content">
                            <label class="field-label">نسبة الإنجاز</label>
                            <p class="field-value">${contract.progress || 'غير محدد'}</p>
                        </div>
                    </div>
                </div>

                <div class="contract-row-split">
                    <div class="field-group">
                        <span class="field-icon">📅</span>
                        <div class="field-content">
                            <label class="field-label">تاريخ البداية</label>
                            <p class="field-value">${contract.contractStart || 'غير محدد'}</p>
                        </div>
                    </div>
                    
                    <div class="field-group">
                        <span class="field-icon">📅</span>
                        <div class="field-content">
                            <label class="field-label">تاريخ الانتهاء</label>
                            <p class="field-value">${contract.contractEnd || 'غير محدد'}</p>
                        </div>
                    </div>
                </div>

                <div class="contract-row">
                    <div class="field-group">
                        <span class="field-icon">📝</span>
                        <div class="field-content">
                            <label class="field-label">تاريخ استلام الوثائق</label>
                            <p class="field-value">${contract.docsReceived || 'لم يتم الاستلام بعد'}</p>
                        </div>
                    </div>
                </div>

                <div class="contract-row">
                    <div class="field-group">
                        <span class="field-icon">📋</span>
                        <div class="field-content">
                            <label class="field-label">حالة الوثائق</label>
                            <p class="field-value">${contract.docsComplianceStatus || 'غير محدد'}</p>
                        </div>
                    </div>
                </div>

                <div class="contract-row highlight-row">
                    <div class="field-group highlight-field">
                        <span class="field-icon">🗓️</span>
                        <div class="field-content">
                            <label class="field-label">التاريخ المجدول لزيارة المراجعين</label>
                            <p class="field-value ${!contract.reviewersVisitScheduled ? 'not-scheduled' : ''}">
                                ${contract.reviewersVisitScheduled || '<span class="warning-text">لم تتم الجدولة</span>'}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="contract-row">
                    <div class="field-group">
                        <span class="field-icon">✅</span>
                        <div class="field-content">
                            <label class="field-label">اتباع شروط التاريخ المجدول</label>
                            <p class="field-value ${getComplianceClass(contract.visitComplianceStatus)}">
                                ${contract.visitComplianceStatus || 'غير محددة'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// الحصول على فئة CSS حسب الحالة
function getStatusClass(status) {
    const statusMap = {
        'تحت الإجراء': 'status-inprogress',
        'مكتمل': 'status-completed',
        'معلق': 'status-pending',
        'ملغي': 'status-cancelled'
    };
    return statusMap[status] || 'status-default';
}

// دالة للحصول على فئة CSS حسب نسبة الإنجاز
function getProgressClass(progress) {
    if (progress === 5) return 'progress-new';
    if (progress === 30) return 'progress-docs';
    if (progress === 40) return 'progress-verification';
    if (progress === 90) return 'progress-review';
    // أي progress = 0 أو فارغ → بدون كلاس
    return '';
}

// دالة فلترة العقود حسب progress
function filterContracts(contracts, progressFilter) {
    return contracts.filter(contract => {
        const progress = contract.progress;

        if (progressFilter === "") {
            return true; // جميع العقود
        } else if (progressFilter === "undefined") {
            // أي عقد فارغ أو 0 أو غير معروف
            return progress === 0 || progress === "" || progress === null || progress === undefined;
        } else {
            return progress === Number(progressFilter);
        }
    });
}

// تحديث عرض العقود لكل تاب
function updateContracts(tabId, contracts) {
    const filterValue = document.querySelector(`#filter-progress-${tabId}`).value;
    const filtered = filterContracts(contracts, filterValue);

    document.querySelector(`#count-${tabId}`).textContent = filtered.length;

    const container = document.querySelector(`#contracts-${tabId}`);
    container.innerHTML = filtered.map(c => `<p>${c.name} - ${c.progress || 'غير محدد'}</p>`).join('');
}

// ربط الفلتر لكل تاب
['scheduled','not-scheduled','undefined'].forEach(tab => {
    document.querySelector(`#filter-progress-${tab}`).addEventListener('change', () => {
        updateContracts(tab, window[`contracts_${tab}`] || []);
    });
});

// الحصول على فئة CSS حسب حالة الامتثال
function getComplianceClass(status) {
    if (!status) return 'compliance-undefined';
    if (status.includes('لم تتم الجدولة')) return 'compliance-notscheduled';
    if (status.includes('تم جدولة الزيارة')) return 'compliance-scheduled';
    return 'compliance-undefined';
}

// ملء قوائم الفلاتر
function populateFilters() {
    const universities = [...new Set(contractsData.map(c => c.university))].sort();
    const departments = [...new Set(contractsData.map(c => c.department))].sort();

    ['scheduled', 'not-scheduled', 'undefined'].forEach(tabName => {
        const universitySelect = document.getElementById('filter-university-' + tabName);
        const departmentSelect = document.getElementById('filter-department-' + tabName);

        if (universitySelect) {
            universities.forEach(uni => {
                const option = document.createElement('option');
                option.value = uni;
                option.textContent = uni;
                universitySelect.appendChild(option);
            });
        }

        if (departmentSelect) {
            departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept;
                option.textContent = dept;
                departmentSelect.appendChild(option);
            });
        }
    });
}

// إعداد مستمعي الأحداث للفلاتر والبحث
function setupEventListeners() {
    ['scheduled', 'not-scheduled', 'undefined'].forEach(tabName => {
        const searchInput = document.getElementById('search-' + tabName);
        const universityFilter = document.getElementById('filter-university-' + tabName);
        const departmentFilter = document.getElementById('filter-department-' + tabName);
        const progressFilter = document.getElementById('filter-progress-' + tabName);

        [searchInput, universityFilter, departmentFilter, progressFilter].forEach(element => {
            if (element) {
                element.addEventListener('input', () => applyFilters(tabName));
                element.addEventListener('change', () => applyFilters(tabName));
            }
        });
    });
}

// تطبيق الفلاتر على التبويب
function applyFilters(tabName) {
    const searchValue = document.getElementById('search-' + tabName)?.value.toLowerCase() || '';
    const universityValue = document.getElementById('filter-university-' + tabName)?.value || '';
    const departmentValue = document.getElementById('filter-department-' + tabName)?.value || '';
    const progressValue = document.getElementById('filter-progress-' + tabName)?.value || '';

    const { scheduled, notScheduled, undefined } = categorizeContracts();
    
    let contracts;
    if (tabName === 'scheduled') {
        contracts = scheduled;
    } else if (tabName === 'not-scheduled') {
        contracts = notScheduled;
    } else {
        contracts = undefined;
    }

    // تطبيق الفلاتر
    const filtered = contracts.filter(contract => {
        const matchSearch = !searchValue || 
            contract.program?.toLowerCase().includes(searchValue) ||
            contract.university?.toLowerCase().includes(searchValue) ||
            contract.department?.toLowerCase().includes(searchValue);
        
        const matchUniversity = !universityValue || contract.university === universityValue;
        const matchDepartment = !departmentValue || contract.department === departmentValue;
        const matchProgress = !progressValue || contract.progress?.startsWith(progressValue);

        return matchSearch && matchUniversity && matchDepartment && matchProgress;
    });

    renderContracts(tabName, filtered);
}
