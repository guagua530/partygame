document.addEventListener('DOMContentLoaded', function() {
    // 设置活动开始时间 - 2025年5月10日20:00
    const eventDate = new Date(2025, 4, 10, 20, 0, 0); // 注意月份是从0开始的，所以5月是4
    
    // 检查当前时间是否达到活动时间
    function checkTime() {
        const now = new Date();
        const timeRemaining = eventDate - now;
        
        if (timeRemaining > 0) {
            // 还未到活动时间，显示倒计时
            showCountdown(timeRemaining);
            return false;
        } else {
            // 已到活动时间，可以显示问题
            hideCountdown();
            return true;
        }
    }
    
    // 创建并显示倒计时元素
    function createCountdownElements() {
        // 创建倒计时容器
        const countdownContainer = document.createElement('div');
        countdownContainer.id = 'countdown-container';
        countdownContainer.className = 'countdown-container';
        
        // 创建倒计时消息
        const countdownMessage = document.createElement('div');
        countdownMessage.className = 'countdown-message';
        countdownMessage.textContent = '当前时间还没到，请耐心等待聚会开始，倒计时：';
        
        // 创建倒计时显示
        const countdownDisplay = document.createElement('div');
        countdownDisplay.id = 'countdown-display';
        countdownDisplay.className = 'countdown-display';
        
        // 添加到DOM
        countdownContainer.appendChild(countdownMessage);
        countdownContainer.appendChild(countdownDisplay);
        
        // 获取问题容器并隐藏
        const questionContainer = document.querySelector('.question-container');
        questionContainer.style.display = 'none';
        
        // 获取按钮并隐藏
        const nextButton = document.getElementById('nextBtn');
        nextButton.style.display = 'none';
        
        // 获取分类选择器并隐藏
        const categorySelector = document.querySelector('.category-selector');
        categorySelector.style.display = 'none';
        
        // 添加到游戏卡片中
        const gameCard = document.querySelector('.game-card');
        gameCard.insertBefore(countdownContainer, questionContainer);
        
        // 添加CSS
        addCountdownStyles();
    }
    
    // 添加倒计时样式
    function addCountdownStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .countdown-container {
                background-color: #fff;
                border-radius: 18px;
                padding: 30px;
                margin-bottom: 30px;
                min-height: 220px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
                position: relative;
                transition: all 0.3s ease;
                text-align: center;
            }
            
            .countdown-message {
                font-size: 18px;
                line-height: 1.7;
                color: #333;
                font-weight: 500;
                margin-bottom: 20px;
                letter-spacing: 0.5px;
            }
            
            .countdown-display {
                font-size: 28px;
                font-weight: 700;
                color: #e45a76;
                letter-spacing: 2px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                animation: pulse 1s infinite alternate;
            }
            
            @keyframes pulse {
                from { transform: scale(1); }
                to { transform: scale(1.05); }
            }
            
            @media (max-width: 480px) {
                .countdown-container {
                    padding: 22px;
                    min-height: 200px;
                    margin-bottom: 25px;
                }
                
                .countdown-message {
                    font-size: 16px;
                }
                
                .countdown-display {
                    font-size: 24px;
                }
            }
            
            @media (max-width: 360px) {
                .countdown-container {
                    padding: 18px;
                    min-height: 180px;
                }
                
                .countdown-message {
                    font-size: 14px;
                }
                
                .countdown-display {
                    font-size: 20px;
                }
            }
            
            @media (prefers-color-scheme: dark) {
                .countdown-container {
                    background-color: rgba(55, 55, 60, 0.9);
                }
                
                .countdown-message {
                    color: #f0f0f0;
                }
                
                .countdown-display {
                    color: #ff7a8a;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 显示倒计时
    function showCountdown(timeRemaining) {
        if (!document.getElementById('countdown-container')) {
            createCountdownElements();
        }
        
        const countdownDisplay = document.getElementById('countdown-display');
        if (countdownDisplay) {
            const { hours, minutes, seconds } = calculateTimeRemaining(timeRemaining);
            countdownDisplay.textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
        }
    }
    
    // 隐藏倒计时，显示游戏界面
    function hideCountdown() {
        const countdownContainer = document.getElementById('countdown-container');
        if (countdownContainer) {
            countdownContainer.style.display = 'none';
        }
        
        const questionContainer = document.querySelector('.question-container');
        if (questionContainer) {
            questionContainer.style.display = 'flex';
        }
        
        const nextButton = document.getElementById('nextBtn');
        if (nextButton) {
            nextButton.style.display = 'block';
        }
        
        const categorySelector = document.querySelector('.category-selector');
        if (categorySelector) {
            categorySelector.style.display = 'flex';
        }
    }
    
    // 计算剩余时间
    function calculateTimeRemaining(timeRemaining) {
        const totalSeconds = Math.floor(timeRemaining / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return { hours, minutes, seconds };
    }
    
    // 补零函数
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }
    
    // 每秒更新倒计时
    function startCountdown() {
        const timerInterval = setInterval(function() {
            const isTimeReached = checkTime();
            if (isTimeReached) {
                clearInterval(timerInterval);
                // 可以选择刷新页面或直接显示游戏
                initializeGame();
            }
        }, 1000);
    }
    
    // 初始化游戏功能
    function initializeGame() {
        // 禁用双击缩放（移动端优化）
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd < 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
        
        // 原始问题（前31个）
        const originalQuestions = [
            "今天你想跟谁共进晚餐？",
            "你会想出名吗？以什么样方式出名昵？",
            "如果有一天时间可以做你想做的三件事情，你会怎样安排？",
            "你最想唱歌给谁听？",
            "如果你可以活到90岁，并能在30岁过后让体态或大脑一直保持30岁的状态到死，你会选保持体态还是大脑呢？",
            "你有曾经预感过自己会怎么死亡吗？",
            "举出3个你与在座的某个人的共同点。",
            "你人生中你最感激什么？",
            "用四分钟跟你对面这位分享你的一生。",
            "如果你明早一觉醒来发现自己获得了某种能力，你希望是什么能力？",
            "如果一颗魔法水晶球能告诉你有关你自己，你的人生，你的未来，或任何事情，你会想知道什么？",
            "你有已经梦想了很久，想做的事情吗？你为什么还没去做？",
            "你人生中最大的成就是什么？",
            "一段友情中你最珍视的是什么？",
            "你最珍贵的一段回忆是什么？",
            "你最糟糕的一段回忆是什么？",
            "如果你知道你会在一年后突然死去，你会想改变任何你现在的生活方式吗？",
            "友情对你来说代表什么？",
            "轮流分享你觉得你的恋人应该具有的五项好品质？",
            "你的家庭亲密温暖吗？你觉得你的童年有比别人幸福点吗？",
            "你觉得你跟你的母亲的关系怎么样呢？",
            '用"我们"做主语造三个肯定句，一定要逗笑在场的所有人。',
            '完成以下句子"我希望我有一个人能与ta分享..."',
            "如果你会跟你对面的人变成最亲密的好友，分享一下你觉得对方必需得知道的事情。",
            "告诉你对面的人你喜欢ta什么，说一些你通常不会告诉刚认识的人的答案。",
            "分享你人生中很尴尬的一刻。",
            "你上一次在别人面前哭是什么时候？上一次自己哭是什么时候？",
            "告诉在座的某个人你已经喜欢上ta的什么？",
            "有什么人事物是太严重，不能随便开玩笑的？",
            "如果你将在今晚死去，没有任何再与他人交流的机会，你最后悔没有跟别人说什么？",
            "你的家着火了，里面有你所拥有的一切事物.在救出你爱的人，你的宠物后，你还有时间最后再冲回去一趟拯救最后一样任何东西，你会救出什么？"
        ];
        
        // 新增心理学问题
        const psychologyQuestions = [
            "如果可以读取在座任何一个人的思想，你会选择谁，为什么？",
            "你认为自己最大的心理优势是什么？这个优势如何影响了你的人生？",
            "你有没有因为害怕被评判而隐藏自己真实的一面？在什么情况下？",
            "如果可以删除一段痛苦的记忆，你会选择删除吗？为什么？",
            "在面对困难选择时，你通常依靠直觉还是理性分析？举一个例子。",
            "如果有一种药丸可以让你永远不再感到悲伤，但也会减弱你感受快乐的能力，你会服用吗？",
            "描述一个改变了你世界观的经历或想法。",
            "你认为自己是感性的人还是理性的人？这在你的决策中如何体现？",
            "你曾经有过的最大心理突破是什么？是什么触发了这个突破？",
            "在人际关系中，你最害怕什么？这种恐惧源自何处？",
            "当你感到孤独时，你通常会怎么做？",
            "你认为自己5年后会变成什么样的人？有什么不同？",
            "你觉得自己的性格中，哪些特质是天生的，哪些是后天环境塑造的？",
            "如果必须永远放弃一种情感（如快乐、愤怒、恐惧等），你会选择放弃哪一种？为什么？",
            "在解决冲突时，你更倾向于妥协还是坚持自己的立场？举个例子。",
            "面对错误或失败，你通常如何应对？这种方式对你有帮助吗？",
            "你的童年经历如何塑造了现在的你？有什么是你想改变的吗？",
            "如果可以瞬间掌握一项技能，不需要练习，你会选择什么？这反映了你什么样的价值观？",
            "你如何看待脆弱？在什么情况下你会允许自己展现脆弱的一面？",
            "描述一个对你产生重大影响的梦境，你认为它代表了什么？",
            "如果让你描述自己的内心世界是什么样子的，你会怎么描述？",
            "你认为真正的自由是什么？你在生活中实现了这种自由吗？",
            "在座的每个人中，你觉得谁最了解自己？为什么这么认为？",
            "你有没有因为别人的期望而活着？这种感觉如何？",
            "如果你可以改变自己的一个性格特点，你会改变什么？为什么？",
            "当你感到压力巨大时，你内心的声音通常会对你说什么？",
            "在关系中，你认为诚实重要还是保护对方的感受更重要？为什么？",
            "你是否有过这样的经历：某个人对你来说非常重要，但后来你意识到这种关系不健康？",
            "如果你的人生是一本书，现在是哪一章？这一章的标题会是什么？"
        ];
        
        // 所有问题
        let allQuestions = [...originalQuestions, ...psychologyQuestions];
        
        // 当前选中的分类
        let currentCategory = 'all';
        let currentQuestions = allQuestions;
        
        const questionElement = document.getElementById('question');
        const questionNumberElement = document.getElementById('questionNumber');
        const nextButton = document.getElementById('nextBtn');
        const gameCard = document.querySelector('.game-card');
        const questionContainer = document.querySelector('.question-container');
        const categoryButtons = document.querySelectorAll('.category-btn');
        
        let usedQuestions = [];
        let currentQuestionIndex = null;
        
        // 检测设备是否支持触摸
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // 更新问题总数显示
        function updateTotalQuestions() {
            const totalQuestions = currentQuestions.length;
            document.querySelector('.question-number').innerHTML = `<i class="fas fa-question-circle"></i> 问题 <span id="questionNumber">${currentQuestionIndex !== null ? currentQuestionIndex + 1 : '?'}</span>/${totalQuestions}`;
        }
        
        // 分类按钮点击事件
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 添加按钮点击效果
                button.classList.add('pulse');
                setTimeout(() => button.classList.remove('pulse'), 300);
                
                // 移除所有分类按钮的active类
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // 为当前点击的按钮添加active类
                button.classList.add('active');
                
                // 更新当前分类
                currentCategory = button.dataset.category;
                
                // 根据分类设置问题集
                if (currentCategory === 'all') {
                    currentQuestions = allQuestions;
                } else if (currentCategory === 'original') {
                    currentQuestions = originalQuestions;
                } else if (currentCategory === 'psychology') {
                    currentQuestions = psychologyQuestions;
                }
                
                // 重置已使用问题
                usedQuestions = [];
                
                // 更新问题总数
                updateTotalQuestions();
                
                // 显示提示
                showToast(`已切换到${currentCategory === 'all' ? '全部' : currentCategory === 'original' ? '经典' : '心理'}问题`);
                
                // 重置问题显示
                questionElement.textContent = '点击下方按钮开始游戏';
                questionNumberElement.textContent = '?';
                
                // 添加卡片翻转效果
                gameCard.style.transform = 'rotateY(3deg)';
                setTimeout(() => {
                    gameCard.style.transform = 'rotateY(0)';
                }, 300);
            });
        });
        
        // 获取随机问题
        function getRandomQuestion() {
            // 如果所有问题都已经使用过，重置usedQuestions数组
            if (usedQuestions.length === currentQuestions.length) {
                usedQuestions = [];
                // 显示全部问题已经被问过的提示
                showToast('所有问题都已问过一遍，开始新一轮！');
            }
            
            // 从当前问题集中过滤出未使用的问题
            let availableQuestions = currentQuestions.filter((_, index) => !usedQuestions.includes(index));
            let randomIndex = Math.floor(Math.random() * availableQuestions.length);
            let questionIndex = currentQuestions.indexOf(availableQuestions[randomIndex]);
            
            usedQuestions.push(questionIndex);
            currentQuestionIndex = questionIndex;
            
            return {
                question: currentQuestions[questionIndex],
                number: questionIndex + 1
            };
        }
        
        // 创建提示消息
        function showToast(message) {
            // 检查是否已存在toast，避免多次点击创建多个toast
            const existingToast = document.querySelector('.toast');
            if (existingToast) {
                existingToast.remove();
            }
            
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            
            // 淡入效果
            setTimeout(() => {
                toast.style.opacity = 1;
                toast.style.transform = 'translate(-50%, 0)';
            }, 10);
            
            // 3秒后淡出
            setTimeout(() => {
                toast.style.opacity = 0;
                toast.style.transform = 'translate(-50%, 20px)';
                
                // 动画结束后移除元素
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 3000);
        }
        
        // 更新问题显示
        function updateQuestion() {
            // 添加卡片翻转效果
            gameCard.style.transform = 'rotateY(5deg)';
            
            // 添加问题容器上升效果
            questionContainer.style.transform = 'translateY(10px)';
            
            const { question, number } = getRandomQuestion();
            
            // 添加淡出效果
            questionElement.style.opacity = 0;
            questionNumberElement.style.opacity = 0;
            
            setTimeout(() => {
                questionElement.textContent = question;
                questionNumberElement.textContent = number;
                
                // 更新问题总数
                updateTotalQuestions();
                
                // 添加淡入效果
                questionElement.style.opacity = 1;
                questionNumberElement.style.opacity = 1;
                
                // 还原卡片翻转
                gameCard.style.transform = 'rotateY(0)';
                
                // 还原问题容器位置，同时添加微弹跳效果
                questionContainer.style.transform = 'translateY(0)';
            }, 300);
            
            // 添加按钮点击波纹效果
            createRipple(event);
        }
        
        // 创建点击波纹效果
        function createRipple(event) {
            const button = nextButton;
            
            const circle = document.createElement('span');
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `0px`;
            circle.style.top = `0px`;
            circle.classList.add('ripple');
            
            const ripple = button.getElementsByClassName('ripple')[0];
            
            if (ripple) {
                ripple.remove();
            }
            
            button.appendChild(circle);
        }
        
        // 添加CSS
        const style = document.createElement('style');
        style.textContent = `
            .ripple {
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            .toast {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translate(-50%, 20px);
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 12px 24px;
                border-radius: 50px;
                font-size: 14px;
                z-index: 1000;
                opacity: 0;
                transition: all 0.3s ease;
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
            }
            
            .pulse {
                animation: pulse 0.3s ease;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(0.95); }
                100% { transform: scale(1); }
            }
            
            @media (max-width: 480px) {
                .toast {
                    padding: 10px 20px;
                    font-size: 13px;
                    bottom: 20px;
                }
            }
        `;
        document.head.appendChild(style);
        
        // 添加过渡效果
        questionElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        questionNumberElement.style.transition = 'opacity 0.3s ease';
        gameCard.style.transition = 'transform 0.5s ease';
        questionContainer.style.transition = 'transform 0.5s ease';
        
        // 点击按钮更新问题
        nextButton.addEventListener('click', updateQuestion);
        
        // 添加触摸振动反馈（如果设备支持）
        nextButton.addEventListener('click', function() {
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
            
            // 添加按钮动画效果
            this.classList.add('pulse');
            setTimeout(() => this.classList.remove('pulse'), 300);
        });
        
        // 支持键盘空格键操作
        document.addEventListener('keyup', function(e) {
            if (e.key === ' ' || e.keyCode === 32) {
                updateQuestion();
                nextButton.classList.add('active');
                setTimeout(() => nextButton.classList.remove('active'), 200);
            }
        });
        
        // 添加触摸滑动切换问题功能（移动端优化）
        if (isTouchDevice) {
            let startX, startY;
            let distX, distY;
            const threshold = 100; // 滑动阈值
            
            gameCard.addEventListener('touchstart', function(e) {
                startX = e.changedTouches[0].clientX;
                startY = e.changedTouches[0].clientY;
            }, { passive: true });
            
            gameCard.addEventListener('touchend', function(e) {
                distX = e.changedTouches[0].clientX - startX;
                distY = e.changedTouches[0].clientY - startY;
                
                // 判断滑动方向，水平滑动幅度较大且竖直滑动幅度较小时判定为有效滑动
                if (Math.abs(distX) > threshold && Math.abs(distY) < threshold/2) {
                    if (distX > 0) {
                        // 右滑，切换到上一个问题
                        // 这里仅实现下一个问题功能
                        updateQuestion();
                    } else {
                        // 左滑，切换到下一个问题
                        updateQuestion();
                    }
                }
            }, { passive: true });
        }
        
        // 初始化问题总数显示
        updateTotalQuestions();
    }
    
    // 检查时间并启动程序
    const isTimeReached = checkTime();
    if (isTimeReached) {
        // 如果时间已到，直接初始化游戏
        initializeGame();
    } else {
        // 如果时间未到，启动倒计时
        startCountdown();
    }
}); 