
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { getCreativePrompt } from './services/geminiService.js';

export default {
  setup() {
    // 视图状态：'challenge' (默契挑战) 或 'messaging' (匿名留言)
    const viewMode = ref('messaging');
    const username = ref('tokuchi');
    const isFocused = ref(false);
    
    // --- 默契挑战数据 ---
    const challengeTitle = ref('快来加入我的默契挑战，看看我们之间默契程度有几分吧！❤️❤️');
    const questions = ref([
      {
        id: 1,
        title: 'What kind of news am I most likely to stop for?',
        selectedIndex: null,
        options: [
          { label: 'A.', text: 'Internet celebrity cheats and eats melons' },
          { label: 'B.', text: 'Climate Change Data' },
          { label: 'C.', text: 'Network Challenge Incidents' },
          { label: 'D.', text: 'Celebrity makeup failure' }
        ]
      },
      {
        id: 2,
        title: 'What data do you care most about when posting?',
        selectedIndex: null,
        options: [
          { label: 'A.', text: 'Over 10,000 views' },
          { label: 'B.', text: 'Received a little red heart' },
          { label: 'C.', text: 'Recommended to FYP' },
          { label: 'D.', text: 'Friends leave teasing messages' }
        ]
      },
      {
        id: 3,
        title: 'What should I do when my phone has only 10% battery left?',
        selectedIndex: null,
        options: [
          { label: 'A.', text: 'Turn on ultra power saving mode' },
          { label: 'B.', text: 'Borrowing power bank to keep alive' },
          { label: 'C.', text: 'Turn off background refresh' },
          { label: 'D.', text: 'Play while charging' }
        ]
      }
    ]);

    // --- 匿名留言数据 ---
    const answer = ref('');
    const textareaRef = ref(null);
    const messagingPrompt = ref('send me anonymous messages!');
    const localSuggestions = [
      "你太自私了！",
      "其实我暗恋你很久了...",
      "你觉得我是一个怎样的人？",
      "能不能教教我怎么变优秀？",
      "送你一朵小红花 🌹",
      "说实话，你的性格有点古怪"
    ];
    const currentIdx = ref(0);
    const placeholderText = ref(localSuggestions[0]);
    const isRolling = ref(false);
    const isAutoRotating = ref(true);
    let rotateInterval = null;

    // --- 通用状态 ---
    const isSending = ref(false);
    const isSuccess = ref(false);
    // 从 1200 到 5000 之间随机一个起始人数
    const clickCount = ref(Math.floor(Math.random() * 3800) + 1200);
    let clickCountInterval = null;

    // 自动调整高度
    const adjustHeight = () => {
      nextTick(() => {
        const el = textareaRef.value;
        if (el) {
          el.style.height = 'auto';
          el.style.height = el.scrollHeight + 'px';
        }
      });
    };

    // 留言模式的自动旋转
    const startRotation = () => {
      if (rotateInterval) return;
      isAutoRotating.value = true;
      rotateInterval = setInterval(() => {
        if (isAutoRotating.value && !answer.value) {
          currentIdx.value = (currentIdx.value + 1) % localSuggestions.length;
          placeholderText.value = localSuggestions[currentIdx.value];
        }
      }, 2500);
    };

    const stopRotation = () => {
      if (rotateInterval) { clearInterval(rotateInterval); rotateInterval = null; }
      isAutoRotating.value = false;
    };

    onMounted(() => {
      startRotation();
      // 模拟人数缓慢增长
      clickCountInterval = setInterval(() => {
        // 每次增加 1-3 人，模拟真实点击
        clickCount.value += Math.floor(Math.random() * 3) + 1;
      }, 4000);
    });

    onUnmounted(() => {
      stopRotation();
      if (clickCountInterval) clearInterval(clickCountInterval);
    });

    const handleFocus = () => {
      isFocused.value = true;
      if (isAutoRotating.value && !answer.value) {
        answer.value = placeholderText.value;
        stopRotation();
        adjustHeight();
      }
    };

    const handleBlur = () => {
      isFocused.value = false;
    };

    const handleAiSuggest = async () => {
      stopRotation();
      isRolling.value = true;
      setTimeout(() => { isRolling.value = false; }, 300);
      currentIdx.value = (currentIdx.value + 1) % localSuggestions.length;
      answer.value = localSuggestions[currentIdx.value];
      adjustHeight();
    };

    const handleSelectOption = (questionId, optionIndex) => {
      const q = questions.value.find(item => item.id === questionId);
      if (q) {
        q.selectedIndex = optionIndex;
      }
    };

    const handleSend = async () => {
      if (viewMode.value === 'messaging' && !answer.value.trim()) return;
      isSending.value = true;
      try {
        await new Promise(r => setTimeout(r, 1200));
        isSuccess.value = true;
      } finally {
        isSending.value = false;
      }
    };

    const handleReset = () => {
      isSuccess.value = false;
      answer.value = '';
      isFocused.value = false;
      // 重置题目选中状态
      questions.value.forEach(q => q.selectedIndex = null);
      if (viewMode.value === 'messaging') {
        startRotation();
        setTimeout(adjustHeight, 0);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const switchMode = (mode) => {
      viewMode.value = mode;
      isSuccess.value = false;
      if (mode === 'messaging') {
        startRotation();
        setTimeout(adjustHeight, 0);
      } else {
        stopRotation();
      }
    };

    return {
      viewMode,
      username,
      challengeTitle,
      messagingPrompt,
      questions,
      answer,
      textareaRef,
      placeholderText,
      isSending,
      isSuccess,
      clickCount,
      isRolling,
      isFocused,
      handleSend,
      handleReset,
      handleAiSuggest,
      handleFocus,
      handleBlur,
      switchMode,
      adjustHeight,
      handleSelectOption
    };
  },
  template: `
    <div class="w-full min-h-[100dvh] flex flex-col items-center bg-[#F8F9FB] select-none pb-12">
      
      <!-- 主内容界面 -->
      <div v-if="!isSuccess" class="w-full max-w-[440px] px-4 animate-in fade-in duration-500">
        <!-- 首页的模式切换 Tab -->
        <div class="pt-6 flex justify-center">
          <div class="bg-gray-200/50 p-1 rounded-2xl flex w-full shadow-sm">
            <button 
              @click="switchMode('challenge')"
              :class="[
                'flex-1 py-2.5 text-[14px] font-black rounded-xl transition-all',
                viewMode === 'challenge' ? 'bg-white shadow-sm text-black' : 'text-gray-500'
              ]"
            >
              Chemistry
            </button>
            <button 
              @click="switchMode('messaging')"
              :class="[
                'flex-1 py-2.5 text-[14px] font-black rounded-xl transition-all',
                viewMode === 'messaging' ? 'bg-white shadow-sm text-black' : 'text-gray-500'
              ]"
            >
              Message
            </button>
          </div>
        </div>

        <!-- 统一的 Header 布局 -->
        <div class="flex items-start gap-3 mt-8 mb-8 w-full">
          <div class="shrink-0 pt-3">
            <div class="w-14 h-14 rounded-full ama-btn-gradient flex items-center justify-center border-[3px] border-white shadow-md overflow-hidden ring-1 ring-gray-100">
               <svg class="w-10 h-10 text-white translate-y-1.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </div>
          
          <div class="flex flex-col items-start flex-1 min-w-0">
            <span class="text-[#9BA3AF] text-[13px] font-bold mb-1 px-1">@{{ username }}</span>
            <div 
              class="bg-white rounded-[22px] shadow-soft w-full relative flex items-center border border-white transition-all duration-300"
              :class="viewMode === 'challenge' ? 'py-6 px-5 min-h-[90px]' : 'py-4 px-5 min-h-[56px]'"
            >
              <div class="absolute top-5 -left-1.5 w-3.5 h-3.5 bg-white rotate-45 rounded-sm border-l border-b border-gray-50"></div>
              <p class="text-[#1A1C1E] font-bold text-[18px] leading-tight break-words relative z-10 w-full tracking-tight">
                {{ viewMode === 'challenge' ? challengeTitle : messagingPrompt }}
              </p>
            </div>
          </div>
        </div>

        <!-- 内容分发 -->
        <div v-if="viewMode === 'challenge'" class="flex flex-col space-y-6">
          <div v-for="q in questions" :key="q.id" class="bg-white rounded-[26px] p-6 shadow-soft flex flex-col space-y-4 border border-white">
            <div class="flex items-center">
              <span class="bg-[#FF5C5C] text-white text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">
                Question {{ q.id }}
              </span>
            </div>
            <h3 class="text-[#1A1C1E] font-extrabold text-[18px] leading-tight tracking-tight pb-2">
              {{ q.title }}
            </h3>
            <div class="flex flex-col space-y-3">
              <button 
                v-for="(opt, idx) in q.options" 
                :key="opt.label"
                @click="handleSelectOption(q.id, idx)"
                class="relative w-full min-h-[52px] rounded-xl flex items-center px-4 py-2 transition-all active:scale-[0.98]"
                :class="[
                  q.selectedIndex === idx ? 'bg-[#F0FDF4] text-[#22C55E]' : 'bg-[#F3F4F6] text-[#6B7280]'
                ]"
              >
                <span class="font-bold mr-2">{{ opt.label }}</span>
                <span class="font-semibold text-[15px] flex-1 text-left leading-snug">{{ opt.text }}</span>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col">
          <div class="bg-white rounded-[26px] p-6 shadow-soft min-h-[220px] sm:min-h-[260px] flex flex-col relative transition-all duration-200 border border-white overflow-hidden">
            <textarea
              ref="textareaRef"
              v-model="answer"
              @focus="handleFocus"
              @blur="handleBlur"
              @input="adjustHeight"
              :placeholder="placeholderText"
              class="w-full bg-transparent border-none outline-none resize-none text-[18px] sm:text-[20px] font-bold text-black placeholder:text-[#D1D5DB] overflow-hidden leading-snug pt-2"
              style="min-height: 120px;"
            ></textarea>
            <button 
              @click="handleAiSuggest"
              class="absolute bottom-5 right-5 w-11 h-11 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all z-10"
              :class="{'animate-roll': isRolling}"
            >
              <span>🎲</span>
            </button>
          </div>
        </div>

        <!-- 底部透明操作区域 -->
        <div class="mt-8 flex flex-col items-center space-y-6 w-full px-2">
          <div class="flex items-center gap-2 text-[#4B5563] font-bold text-[14px]">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Anonymous answer
          </div>

          <!-- Send 按钮 -->
          <button 
            @click="handleSend"
            :disabled="isSending"
            :class="[
              'w-full max-w-[320px] h-[58px] rounded-full ama-btn-gradient text-white font-black text-[24px] shadow-btn active:scale-[0.98] transition-all transform',
              isSending ? 'animate-send-loading' : '',
              (viewMode === 'challenge' || answer.trim() || isSending) ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            ]"
          >
            <span v-if="!isSending">Send</span>
            <span v-else class="flex items-center justify-center tracking-widest animate-pulse text-[18px]">SENDING...</span>
          </button>

          <!-- 统计与引导按钮区域：输入焦点时通过 v-show 隐藏 -->
          <div v-show="!isFocused" class="flex flex-col items-center w-full space-y-3 pt-2 animate-in fade-in duration-300">
            <div class="flex items-center gap-2 text-[#6B7280] text-[13px] font-bold tabular-nums">
              <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 1 1 3 0m-3 6a1.5 1.5 0 1 0 3 0M7 11.5L14 9L17 12V18L13 22H9C7 22 5 20 5 18V13L7 11.5Z" />
              </svg>
              <span>{{ clickCount }} Users just clicked the button</span>
            </div>

            <button class="w-full h-[58px] rounded-full ama-btn-gradient text-white font-black text-[18px] shadow-btn active:scale-[0.98] transition-all animate-shimmer animate-pulse-attraction">
              Get your own information
            </button>
          </div>
        </div>

        <!-- 隐私政策区域：输入焦点时也隐藏 -->
        <div v-show="!isFocused" class="flex items-center justify-center gap-2 text-[10px] text-[#A1A7B2] font-black uppercase tracking-widest pt-8 pb-4 animate-in fade-in duration-300">
          <a href="#" class="underline underline-offset-4 decoration-1 hover:text-gray-600 transition-colors">Terms of Use</a>
          <span class="text-[#D1D5DB] font-normal">&amp;</span>
          <a href="#" class="underline underline-offset-4 decoration-1 hover:text-gray-600 transition-colors">Privacy Policy</a>
        </div>
      </div>

      <!-- 发送成功界面 (精确重构自截图) -->
      <div v-else class="w-full max-w-[440px] px-6 flex flex-col items-center animate-in fade-in duration-500 h-screen">
        <!-- 顶部返回箭头 -->
        <div class="w-full flex items-center pt-8 pb-12">
          <button @click="handleReset" class="p-2 -ml-2 text-gray-800 transition-opacity active:opacity-40">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>

        <!-- 居中的纸飞机图标 -->
        <div class="w-48 h-48 rounded-full ama-btn-gradient flex items-center justify-center mb-8 shadow-[0_15px_45px_rgba(255,51,102,0.3)]">
          <svg class="w-24 h-24 text-white -rotate-12 translate-x-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </div>

        <!-- 成功状态文字 -->
        <h2 class="text-[20px] font-bold text-[#6B7280] mb-20 tracking-tight">
          Anonymous sending successful
        </h2>
        
        <!-- 统计信息区 (图标 + 文字) -->
        <div class="flex items-center gap-2 text-[#6B7280] text-[15px] font-medium mb-4">
          <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 1 1 3 0m-3 6a1.5 1.5 0 1 0 3 0M7 11.5L14 9L17 12V18L13 22H9C7 22 5 20 5 18V13L7 11.5Z" />
          </svg>
          <span class="tabular-nums">{{ clickCount }} users just clicked the button</span>
        </div>

        <!-- 行动按钮 (成功界面同样应用强吸引力动画) -->
        <div class="w-full">
          <button class="w-full h-[64px] rounded-full ama-btn-gradient text-white font-bold text-[20px] shadow-btn active:scale-[0.98] transition-all animate-shimmer animate-pulse-attraction">
            Get your own information
          </button>
        </div>
      </div>

    </div>
  `
};
