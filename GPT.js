class Block {
    constructor(game, r, c) {
        this.game = game;
        this.row = r;
        this.col = c;

        // 当前显示位置（left, top）
        this.left = c * game.blockWidth;
        this.top = r * game.blockHeight;

        // 目标位置（正确位置）
        this.targetLeft = this.left;
        this.targetTop = this.top;

        // 创建DOM元素
        this.dom = document.createElement('div');
        this.dom.style.width = game.blockWidth + 'px';
        this.dom.style.height = game.blockHeight + 'px';
        this.dom.style.position = 'absolute';
        this.dom.style.background = `url(${game.imgUrl}) no-repeat -${this.targetLeft}px -${this.targetTop}px / ${game.width}px ${game.height}px`;
        this.dom.style.border = '1px solid #fff';
        this.dom.style.boxSizing = 'border-box';  // 修正写法
        this.dom.style.cursor = 'pointer';
        this.dom.style.transition = '0.3s';

        // 绑定点击事件
        this.dom.addEventListener('click', () => {
            if (game.isOver) return;

            // 判断是否与隐藏块相邻
            const isAdjacent = 
                (this.top === game.hideBlock.top && Math.abs(this.left - game.hideBlock.left) === game.blockWidth) ||
                (this.left === game.hideBlock.left && Math.abs(this.top - game.hideBlock.top) === game.blockHeight);

            if (!isAdjacent) return;

            // 交换位置
            game.swap(this, game.hideBlock);

            // 检查游戏是否结束
            game.checkIsOver();
        });

        this.updatePosition();

        // 添加到游戏容器
        game.dom.appendChild(this.dom);
    }

    updatePosition() {
        this.dom.style.left = this.left + 'px';
        this.dom.style.top = this.top + 'px';
    }
}

class Game {
    constructor(config) {
        this.width = config.width;
        this.height = config.height;
        this.rows = config.rows;
        this.cols = config.cols;
        this.imgUrl = config.imgUrl;
        this.dom = config.dom;

        this.isOver = false;

        this.init();
    }

    initCompute() {
        this.blockWidth = this.width / this.cols;
        this.blockHeight = this.height / this.rows;
        this.blockCount = this.rows * this.cols;
    }

    initGameDom() {
        this.dom.innerHTML = '';
        this.dom.style.width = this.width + 'px';
        this.dom.style.height = this.height + 'px';
        this.dom.style.border = '1px solid black';
        this.dom.style.position = 'relative';
        this.dom.style.userSelect = 'none'; // 防止选中
    }

    initBlocks() {
        this.blocks = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const block = new Block(this, r, c);
                this.blocks.push(block);
            }
        }

        // 隐藏最后一个块作为“空白块”
        this.hideBlock = this.blocks[this.blockCount - 1];
        this.hideBlock.dom.style.display = 'none';
    }

    swap(block1, block2) {
        // 交换位置属性
        [block1.left, block2.left] = [block2.left, block1.left];
        [block1.top, block2.top] = [block2.top, block1.top];

        block1.updatePosition();
        block2.updatePosition();
    }

    checkIsOver() {
        this.isOver = this.blocks.every(block => 
            block.left === block.targetLeft && block.top === block.targetTop
        );

        if (this.isOver) {
            this.over();
        }
    }

    over() {
        this.hideBlock.dom.style.display = 'block';
        this.blocks.forEach(block => {
            block.dom.style.border = 'none';
        });
        alert('恭喜你，拼图完成！');
    }

    // 判断逆序数是否为奇数，决定拼图是否可解
    isOddInversions() {
        let inversCount = 0;
        for (let i = 0; i < this.blockCount - 1; i++) {
            for (let j = i + 1; j < this.blockCount - 1; j++) {
                const blockI = this.blocks[i];
                const blockJ = this.blocks[j];

                // 比较块的位置顺序（按top优先，再left）
                if (
                    blockI.top > blockJ.top ||
                    (blockI.top === blockJ.top && blockI.left > blockJ.left)
                ) {
                    inversCount++;
                }
            }
        }
        console.log('逆序数:', inversCount);
        return inversCount % 2 !== 0;
    }

    shuffle() {
        // 洗牌，打乱blocks数组中块的位置
        for (let i = 0; i < this.blocks.length - 1; i++) {
            const index = Math.floor(Math.random() * (this.blocks.length - 1 - i)) + i;
            this.swap(this.blocks[i], this.blocks[index]);
        }

        // 如果逆序数为奇数，交换倒数第二和倒数第三个块，保证拼图可解
        if (this.isOddInversions()) {
            this.swap(this.blocks[this.blockCount - 3], this.blocks[this.blockCount - 2]);
        }
    }

    init() {
        this.initCompute();
        this.initGameDom();
        this.initBlocks();
        this.shuffle();
        this.isOver = false;
    }
}

// 初始化游戏
const game = new Game({
    width: 500,
    height: 500,
    rows: 3,
    cols: 3,
    imgUrl: 'img/img.jfif',
    dom: document.getElementById('game'),
});
