// ========================================
// Python Conditional Statements - Interactive Learning
// ========================================

// State management
const state = {
    dragdrop: { completed: new Set() },
    coding: { completed: new Set() },
    quiz: { answers: {}, submitted: false }
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initMainTabs();
    initPracticeTabs();
    initDemoInputs();
    initDragAndDrop();
    initCodeEditors();
});

// Main Tab Navigation
function initMainTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Practice Sub-Tab Navigation
function initPracticeTabs() {
    const practiceBtns = document.querySelectorAll('.practice-tab-btn');
    const practiceContents = document.querySelectorAll('.practice-content');

    practiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            practiceBtns.forEach(b => b.classList.remove('active'));
            practiceContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const practiceId = btn.dataset.practice;
            document.getElementById(practiceId).classList.add('active');
        });
    });
}

function initDemoInputs() {
    const ifInput = document.getElementById('if-demo-input');
    if (ifInput) {
        ifInput.addEventListener('input', () => {
            document.getElementById('if-demo-value').textContent = ifInput.value;
        });
    }
}

// ========================================
// COPY CODE FUNCTION
// ========================================

function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.textContent;
        button.textContent = '✓ Copied!';
        button.style.color = 'var(--accent-green)';
        button.style.borderColor = 'var(--accent-green)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.color = '';
            button.style.borderColor = '';
        }, 2000);
    });
}

// ========================================
// INTERACTIVE DEMOS
// ========================================

function runIfDemo() {
    const input = document.getElementById('if-demo-input');
    const output = document.getElementById('if-demo-output');
    const displayValue = document.getElementById('if-demo-value');
    
    const number = parseInt(input.value);
    displayValue.textContent = number;
    
    output.classList.remove('error');
    output.classList.add('success');
    
    if (isNaN(number)) {
        output.classList.add('error');
        output.textContent = '❌ Please enter a valid number!';
        return;
    }
    
    if (number > 0) {
        output.innerHTML = `<strong>Output:</strong> Positive number! ➕<br><br>` +
            `<span style="color: var(--text-muted)">📝 Explanation: ${number} > 0 is <span style="color: var(--accent-green)">True</span>, so the first branch executes.</span>`;
    } else {
        output.innerHTML = `<strong>Output:</strong> Zero or negative! ➖<br><br>` +
            `<span style="color: var(--text-muted)">📝 Explanation: ${number} > 0 is <span style="color: var(--accent-red)">False</span>, so the else branch executes.</span>`;
    }
}

function runElifDemo() {
    const input = document.getElementById('elif-demo-input');
    const output = document.getElementById('elif-demo-output');
    const gradeFill = document.getElementById('grade-fill');
    const gradeMarker = document.getElementById('grade-marker');
    
    const score = parseInt(input.value);
    
    output.classList.remove('error');
    output.classList.add('success');
    
    if (isNaN(score) || score < 0 || score > 100) {
        output.classList.add('error');
        output.textContent = '❌ Please enter a valid score between 0 and 100!';
        return;
    }
    
    let grade, message, emoji, color;
    
    if (score >= 90) {
        grade = 'A'; message = 'Excellent!'; emoji = '🌟'; color = 'var(--accent-teal)';
    } else if (score >= 80) {
        grade = 'B'; message = 'Great job!'; emoji = '👍'; color = 'var(--accent-green)';
    } else if (score >= 70) {
        grade = 'C'; message = 'Good effort!'; emoji = '💪'; color = 'var(--accent-yellow)';
    } else if (score >= 60) {
        grade = 'D'; message = 'Keep trying!'; emoji = '📚'; color = 'var(--accent-orange)';
    } else {
        grade = 'F'; message = 'Need improvement'; emoji = '😢'; color = 'var(--accent-red)';
    }
    
    output.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem; color: ${color}">${emoji} Grade: ${grade}</div>
        <div style="color: var(--text-secondary)">${message}</div>
    `;
    
    const percentage = score;
    gradeMarker.style.left = `calc(${percentage}% - 2px)`;
    gradeFill.style.width = `${100 - percentage}%`;
    gradeFill.style.left = `${percentage}%`;
}

function runNestedDemo() {
    const age = parseInt(document.getElementById('nested-age').value);
    const height = parseInt(document.getElementById('nested-height').value);
    const hasTicket = document.getElementById('nested-ticket').checked;
    const output = document.getElementById('nested-demo-output');
    
    const flowTicket = document.getElementById('flow-ticket');
    const flowAge = document.getElementById('flow-age');
    const flowHeight = document.getElementById('flow-height');
    const flowResult = document.getElementById('flow-result');
    
    [flowTicket, flowAge, flowHeight, flowResult].forEach(node => {
        node.classList.remove('active', 'failed');
    });
    
    let messages = [];
    let canRide = true;
    
    if (hasTicket) {
        flowTicket.classList.add('active');
        messages.push('✓ You have a ticket!');
        
        if (age >= 12) {
            flowAge.classList.add('active');
            messages.push('✓ Age requirement met!');
            
            if (height >= 140) {
                flowHeight.classList.add('active');
                flowResult.classList.add('active');
                messages.push('✓ Height requirement met!');
                messages.push('🎢 Enjoy the ride!');
            } else {
                flowHeight.classList.add('failed');
                flowResult.classList.add('failed');
                messages.push(`✗ Sorry, you must be at least 140cm tall. (Current: ${height}cm)`);
                canRide = false;
            }
        } else {
            flowAge.classList.add('failed');
            flowResult.classList.add('failed');
            messages.push(`✗ Sorry, you must be at least 12 years old. (Current: ${age} years)`);
            canRide = false;
        }
    } else {
        flowTicket.classList.add('failed');
        flowResult.classList.add('failed');
        messages.push('✗ Please buy a ticket first!');
        canRide = false;
    }
    
    output.classList.remove('error', 'success');
    output.classList.add(canRide ? 'success' : 'error');
    output.innerHTML = messages.map(m => `<div>${m}</div>`).join('');
}

function runMatchDemo() {
    const day = document.getElementById('match-demo-input').value;
    const output = document.getElementById('match-demo-output');
    
    let mood, emoji, color;
    
    switch(day) {
        case 'Monday':
            mood = 'Start of the work week...'; emoji = '😫'; color = 'var(--accent-red)';
            break;
        case 'Tuesday':
        case 'Wednesday':
        case 'Thursday':
            mood = 'Keep working hard!'; emoji = '💼'; color = 'var(--accent-yellow)';
            break;
        case 'Friday':
            mood = 'TGIF! Almost weekend!'; emoji = '🎉'; color = 'var(--accent-green)';
            break;
        case 'Saturday':
        case 'Sunday':
            mood = 'Weekend! Time to relax!'; emoji = '🎮'; color = 'var(--accent-teal)';
            break;
        default:
            mood = "That's not a valid day!"; emoji = '❓'; color = 'var(--text-muted)';
    }
    
    output.classList.add('success');
    output.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem">${emoji}</div>
        <div style="font-size: 1.2rem; color: ${color}; font-weight: 600">${day}</div>
        <div style="margin-top: 0.5rem">${mood}</div>
    `;
}

// ========================================
// DRAG AND DROP FUNCTIONALITY
// ========================================

let draggedPiece = null;

function initDragAndDrop() {
    // Initialize all drag pieces
    document.querySelectorAll('.drag-piece').forEach(piece => {
        piece.addEventListener('dragstart', handleDragStart);
        piece.addEventListener('dragend', handleDragEnd);
    });

    // Initialize all drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('click', handleDropZoneClick);
    });
}

function handleDragStart(e) {
    draggedPiece = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.value);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedPiece = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const zone = e.currentTarget;
    zone.classList.remove('drag-over');
    
    if (draggedPiece && !zone.classList.contains('filled')) {
        const value = e.dataTransfer.getData('text/plain');
        zone.textContent = value;
        zone.classList.add('filled');
        zone.dataset.currentValue = value;
        draggedPiece.classList.add('used');
        
        // Reset validation classes
        zone.classList.remove('correct', 'incorrect');
    }
}

function handleDropZoneClick(e) {
    const zone = e.currentTarget;
    if (zone.classList.contains('filled')) {
        // Return piece to pool
        const challengeDiv = zone.closest('.drag-challenge');
        const piecesContainer = challengeDiv.querySelector('.drag-pieces');
        const value = zone.dataset.currentValue;
        
        // Find and restore the used piece
        const usedPiece = piecesContainer.querySelector(`.drag-piece.used[data-value="${value}"]`);
        if (usedPiece) {
            usedPiece.classList.remove('used');
        }
        
        // Clear the zone
        zone.textContent = '';
        zone.classList.remove('filled', 'correct', 'incorrect');
        delete zone.dataset.currentValue;
    }
}

function checkDragChallenge(challengeId) {
    const challengeDiv = document.querySelector(`[data-challenge="${challengeId}"]`);
    const dropZones = challengeDiv.querySelectorAll('.drop-zone');
    const resultDiv = document.getElementById(`result-${challengeId}`);
    
    let allCorrect = true;
    let filledCount = 0;
    let correctCount = 0;
    
    dropZones.forEach(zone => {
        const expected = zone.dataset.answer;
        const current = zone.dataset.currentValue;
        
        zone.classList.remove('correct', 'incorrect');
        
        if (current) {
            filledCount++;
            if (current === expected) {
                zone.classList.add('correct');
                correctCount++;
            } else {
                zone.classList.add('incorrect');
                allCorrect = false;
            }
        } else {
            allCorrect = false;
        }
    });
    
    resultDiv.classList.add('show');
    resultDiv.classList.remove('success', 'error', 'partial');
    
    if (filledCount < dropZones.length) {
        resultDiv.classList.add('partial');
        resultDiv.innerHTML = `⚠️ Please fill in all the blanks! (${filledCount}/${dropZones.length} filled)`;
    } else if (allCorrect) {
        resultDiv.classList.add('success');
        resultDiv.innerHTML = `🎉 <strong>Perfect!</strong> All pieces are in the correct place!`;
        
        // Mark as completed
        state.dragdrop.completed.add(challengeId);
        updateProgress('dragdrop');
    } else {
        resultDiv.classList.add('error');
        resultDiv.innerHTML = `❌ Not quite right. ${correctCount}/${dropZones.length} correct. The red pieces are in the wrong place - click them to remove and try again!`;
    }
}

function resetDragChallenge(challengeId) {
    const challengeDiv = document.querySelector(`[data-challenge="${challengeId}"]`);
    const dropZones = challengeDiv.querySelectorAll('.drop-zone');
    const pieces = challengeDiv.querySelectorAll('.drag-piece');
    const resultDiv = document.getElementById(`result-${challengeId}`);
    
    // Clear all zones
    dropZones.forEach(zone => {
        zone.textContent = '';
        zone.classList.remove('filled', 'correct', 'incorrect');
        delete zone.dataset.currentValue;
    });
    
    // Reset all pieces
    pieces.forEach(piece => {
        piece.classList.remove('used');
    });
    
    // Hide result
    resultDiv.classList.remove('show');
}

// ========================================
// CODING CHALLENGES
// ========================================

function initCodeEditors() {
    // Update line counts on input
    document.querySelectorAll('.code-textarea').forEach(textarea => {
        textarea.addEventListener('input', (e) => {
            const id = e.target.id.replace('-input', '');
            const lineCountSpan = document.getElementById(`lines-${id}`);
            if (lineCountSpan) {
                const lines = e.target.value.split('\n').length;
                lineCountSpan.textContent = lines;
            }
        });
        
        // Handle tab key
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 4;
            }
        });
    });
}

function toggleCodingHint(challengeId) {
    const hint = document.getElementById(`hint-${challengeId}`);
    hint.classList.toggle('show');
}

function runCodingChallenge(challengeId) {
    const textarea = document.getElementById(`${challengeId}-input`);
    const code = textarea.value.toLowerCase();
    const resultDiv = document.getElementById(`result-${challengeId}`);
    
    resultDiv.classList.add('show');
    resultDiv.classList.remove('success', 'error', 'partial');
    
    let isCorrect = false;
    let feedback = '';
    
    switch(challengeId) {
        case 'code1':
            isCorrect = checkCode1(code);
            feedback = isCorrect ? 
                `🎉 <strong>Excellent!</strong> Your code correctly identifies positive, negative, and zero numbers!<br><br>
                <strong>Key concepts used:</strong>
                <ul style="margin-top: 0.5rem; margin-left: 1rem;">
                    <li>Comparison operators (<code>&gt;</code>, <code>&lt;</code>, <code>==</code>)</li>
                    <li>if-elif-else chain</li>
                </ul>` :
                `❌ <strong>Not quite!</strong> Make sure your code:<br>
                <ul style="margin-top: 0.5rem; margin-left: 1rem;">
                    <li>Prints <code>"Positive"</code>, <code>"Negative"</code>, and <code>"Zero"</code></li>
                    <li>Uses <code>if</code>, <code>elif</code>/<code>else</code> structure</li>
                    <li>Compares the number with <code>0</code></li>
                </ul>
                <br><em>💡 There are multiple valid solutions! You can check conditions in any order.</em>`;
            break;
            
        case 'code2':
            isCorrect = checkCode2(code);
            feedback = isCorrect ?
                `🎉 <strong>Great job!</strong> Your age category classifier works correctly!<br><br>
                <strong>Key concepts used:</strong>
                <ul style="margin-top: 0.5rem; margin-left: 1rem;">
                    <li>Multiple elif conditions</li>
                    <li>Range checking with <code>&lt;=</code> and <code>&gt;=</code></li>
                </ul>` :
                `❌ <strong>Check your logic!</strong> Make sure your code:<br>
                <ul style="margin-top: 0.5rem; margin-left: 1rem;">
                    <li>Prints all four categories: <code>"Child"</code>, <code>"Teenager"</code>, <code>"Adult"</code>, <code>"Senior"</code></li>
                    <li>Uses <code>if</code> and <code>elif</code> structure</li>
                    <li>Checks the age boundaries (12/13, 17/18, 64/65)</li>
                </ul>
                <br><em>💡 You can check ages in different orders - just make sure your ranges don't overlap!</em>`;
            break;
            
        case 'code3':
            isCorrect = checkCode3(code);
            feedback = isCorrect ?
                `🎉 <strong>Excellent work!</strong> Your nested login system is correct!<br><br>
                <strong>Key concepts used:</strong>
                <ul style="margin-top: 0.5rem; margin-left: 1rem;">
                    <li>Nested if statements</li>
                    <li>String comparison with <code>==</code></li>
                    <li>Multiple levels of validation</li>
                </ul>` :
                `❌ <strong>Almost there!</strong> Make sure your code:<br>
                <ul style="margin-top: 0.5rem; margin-left: 1rem;">
                    <li>Checks <code>username</code> against <code>"admin"</code></li>
                    <li>Checks <code>password</code> against <code>"1234"</code></li>
                    <li>Uses <strong>nested</strong> if statements (one inside another)</li>
                    <li>Has different messages for success and failure</li>
                </ul>
                <br><em>💡 The password check should be inside the username check!</em>`;
            break;
    }
    
    if (isCorrect) {
        resultDiv.classList.add('success');
        state.coding.completed.add(challengeId);
        updateProgress('coding');
    } else {
        resultDiv.classList.add('error');
    }
    
    resultDiv.innerHTML = feedback;
}

function checkCode1(code) {
    // Flexible check - multiple valid solutions exist!
    // The code must print "Positive", "Negative", and "Zero" based on conditions
    
    // Check that all three outputs exist
    const hasPositive = code.includes('positive');
    const hasNegative = code.includes('negative');
    const hasZero = code.includes('zero');
    
    // Check for conditional structure
    const hasIf = code.includes('if');
    const hasElifOrElse = code.includes('elif') || code.includes('else');
    
    // Check for some comparison with 0 (any valid comparison)
    const hasComparison = code.includes('> 0') || code.includes('>0') || 
                          code.includes('< 0') || code.includes('<0') ||
                          code.includes('== 0') || code.includes('==0') ||
                          code.includes('!= 0') || code.includes('!=0') ||
                          code.includes('>= 0') || code.includes('>=0') ||
                          code.includes('<= 0') || code.includes('<=0');
    
    // Check for print statements
    const hasPrint = code.includes('print');
    
    // Valid if has all outputs, uses conditionals, and has comparisons
    return hasPositive && hasNegative && hasZero && hasIf && hasElifOrElse && hasComparison && hasPrint;
}

function checkCode2(code) {
    // Flexible check for age categories
    // Multiple valid approaches: checking ranges differently, different order, etc.
    
    // Check that all four categories are mentioned
    const hasChild = code.includes('child');
    const hasTeenager = code.includes('teenager') || code.includes('teen');
    const hasAdult = code.includes('adult');
    const hasSenior = code.includes('senior');
    
    // Check for conditional structure with multiple branches
    const hasIf = code.includes('if');
    const hasElif = code.includes('elif');
    
    // Check for age-related comparisons (flexible - any age boundary checks)
    const hasAgeChecks = (code.includes('12') || code.includes('13')) &&
                         (code.includes('17') || code.includes('18')) &&
                         (code.includes('64') || code.includes('65'));
    
    // Check for print statements
    const hasPrint = code.includes('print');
    
    return hasChild && hasTeenager && hasAdult && hasSenior && hasIf && hasElif && hasAgeChecks && hasPrint;
}

function checkCode3(code) {
    // Flexible check for nested login structure
    // The key is: nested ifs checking username then password
    
    // Check for username validation
    const hasUsernameCheck = code.includes('username') && code.includes('admin');
    
    // Check for password validation  
    const hasPasswordCheck = code.includes('password') && code.includes('1234');
    
    // Check for nested structure (at least 2 if statements)
    const hasNestedIf = (code.match(/if/g) || []).length >= 2;
    
    // Check for different outcome messages (flexible - just needs to have distinct outputs)
    const hasSuccessMessage = code.includes('success') || code.includes('welcome') || 
                              code.includes('login') || code.includes('correct') ||
                              code.includes('✅') || code.includes('granted');
    const hasFailMessage = code.includes('wrong') || code.includes('incorrect') || 
                           code.includes('invalid') || code.includes('fail') ||
                           code.includes('❌') || code.includes('error') ||
                           code.includes('not found') || code.includes('denied');
    
    // Check for print and else
    const hasPrint = code.includes('print');
    const hasElse = code.includes('else');
    
    return hasUsernameCheck && hasPasswordCheck && hasNestedIf && 
           hasSuccessMessage && hasFailMessage && hasPrint && hasElse;
}

// ========================================
// CODE ANALYSIS QUIZ
// ========================================

const quizAnswers = {
    'analysis-q1': 'a',  // x=10, y=5, x>y prints "A"
    'analysis-q2': 'c',  // score=75, >= 70 so "C"
    'analysis-q3': 'c',  // All three separate ifs will print
    'analysis-q4': 'b',  // has_ticket=True, age=15 < 18, so "Too young"
    'analysis-q5': 'd'   // color="blue" doesn't match any case, so "_" prints "Unknown"
};

function submitAnalysisQuiz() {
    if (state.quiz.submitted) return;
    
    let score = 0;
    const breakdown = [];
    
    // Check each question
    Object.keys(quizAnswers).forEach((questionName, index) => {
        const selected = document.querySelector(`input[name="${questionName}"]:checked`);
        const questionDiv = document.querySelector(`[data-question="q${index + 1}"]`);
        const correctAnswer = quizAnswers[questionName];
        
        const labels = questionDiv.querySelectorAll('.option-label');
        labels.forEach(label => {
            const input = label.querySelector('input');
            if (input.value === correctAnswer) {
                label.classList.add('correct');
            }
            if (selected && input.value === selected.value && selected.value !== correctAnswer) {
                label.classList.add('incorrect');
            }
        });
        
        const isCorrect = selected && selected.value === correctAnswer;
        if (isCorrect) {
            score++;
            questionDiv.classList.add('answered-correct');
        } else {
            questionDiv.classList.add('answered-wrong');
        }
        
        breakdown.push({
            question: index + 1,
            correct: isCorrect,
            yourAnswer: selected ? selected.value.toUpperCase() : 'No answer',
            correctAnswer: correctAnswer.toUpperCase()
        });
    });
    
    // Show results
    const resultDiv = document.getElementById('quiz-final-result');
    const scoreSpan = document.getElementById('quiz-score');
    const messageDiv = document.getElementById('quiz-message');
    const breakdownDiv = document.getElementById('quiz-breakdown');
    
    scoreSpan.textContent = score;
    
    let message = '';
    if (score === 5) {
        message = '🏆 Perfect Score! You\'re a Python conditionals master!';
    } else if (score >= 4) {
        message = '🌟 Excellent! You understand conditionals very well!';
    } else if (score >= 3) {
        message = '👍 Good job! Review the incorrect answers above.';
    } else if (score >= 2) {
        message = '📚 Keep practicing! Go back and study the lessons.';
    } else {
        message = '💪 Don\'t give up! Review each section and try again.';
    }
    
    messageDiv.textContent = message;
    
    // Build breakdown HTML
    let breakdownHTML = '';
    breakdown.forEach(item => {
        const className = item.correct ? 'correct' : 'wrong';
        const icon = item.correct ? '✓' : '✗';
        breakdownHTML += `
            <div class="breakdown-item ${className}">
                <span>${icon} Question ${item.question}</span>
                <span>${item.correct ? 'Correct' : `Your: ${item.yourAnswer} | Correct: ${item.correctAnswer}`}</span>
            </div>
        `;
    });
    breakdownDiv.innerHTML = breakdownHTML;
    
    resultDiv.classList.add('show');
    state.quiz.submitted = true;
    
    // Disable all radio buttons
    document.querySelectorAll('.analysis-question input[type="radio"]').forEach(input => {
        input.disabled = true;
    });
    
    // Hide submit button
    document.querySelector('.submit-quiz-btn').style.display = 'none';
}

function resetAnalysisQuiz() {
    state.quiz.submitted = false;
    
    // Reset all questions
    document.querySelectorAll('.analysis-question').forEach(q => {
        q.classList.remove('answered-correct', 'answered-wrong');
    });
    
    // Reset all options
    document.querySelectorAll('.option-label').forEach(label => {
        label.classList.remove('correct', 'incorrect');
    });
    
    // Clear all selections and enable inputs
    document.querySelectorAll('.analysis-question input[type="radio"]').forEach(input => {
        input.checked = false;
        input.disabled = false;
    });
    
    // Hide results
    document.getElementById('quiz-final-result').classList.remove('show');
    
    // Show submit button
    document.querySelector('.submit-quiz-btn').style.display = 'block';
}

// ========================================
// PROGRESS TRACKING
// ========================================

function updateProgress(section) {
    let progressDiv, totalItems;
    
    if (section === 'dragdrop') {
        progressDiv = document.getElementById('dragdrop-progress');
        totalItems = 4;
        
        const dots = progressDiv.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (state.dragdrop.completed.has(`drag${index + 1}`)) {
                dot.classList.add('completed');
            }
        });
        
        const completedCount = state.dragdrop.completed.size;
        progressDiv.querySelector('.progress-text').textContent = `${completedCount}/${totalItems} completed`;
        
    } else if (section === 'coding') {
        progressDiv = document.getElementById('coding-progress');
        totalItems = 3;
        
        const dots = progressDiv.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (state.coding.completed.has(`code${index + 1}`)) {
                dot.classList.add('completed');
            }
        });
        
        const completedCount = state.coding.completed.size;
        progressDiv.querySelector('.progress-text').textContent = `${completedCount}/${totalItems} completed`;
    }
    
    // Check if section is complete and update tab
    updateTabCompletion();
}

function updateTabCompletion() {
    const tabs = document.querySelectorAll('.practice-tab-btn');
    
    // Drag & Drop complete
    if (state.dragdrop.completed.size >= 4) {
        tabs[0].classList.add('completed');
    }
    
    // Coding complete
    if (state.coding.completed.size >= 3) {
        tabs[1].classList.add('completed');
    }
    
    // Quiz complete
    if (state.quiz.submitted) {
        tabs[2].classList.add('completed');
    }
}

// ========================================
// UTILITY - Toggle Hint (for old challenges)
// ========================================

function toggleHint(hintId) {
    const hint = document.getElementById(hintId);
    if (hint) {
        hint.classList.toggle('show');
    }
}

// Initialize on window load for animations
window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});
