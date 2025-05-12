const game = new Game({
    width: 800,
    height: 500,
    rows: 3,
    cols: 3,
    imgUrl: 'img/gt.jpg',
    dom: document.getElementById('game'),
});

function Block(game, r, c){
    //当前位置
    this.left = c * game.blockWidth;
    this.top = r * game.blockHeight;

    //目标位置
    this.targetLeft = this.left;
    this.targetTop = this.top;
    
    //创建DOM元素
    this.dom = document.createElement('div');
    this.dom.style.width = game.blockWidth + 'px';
    this.dom.style.height = game.blockHeight + 'px';
    this.dom.style.position = 'absolute';
    this.dom.style.background = `url(${game.imgUrl}) no-repeat -${this.targetLeft}px -${this.targetTop}px / ${game.width}px ${game.height}px`;
    this.dom.style.border = '1px solid #fff';
    this.dom.style.boxSizing = 'border - box';
    this.dom.style.cursor = 'pointer';
    this.dom.style.transition = '0.3s';
    
    /**
     * 更新位置
     */
    this.updataPosition = function(){
        this.dom.style.left = this.left+'px';
        this.dom.style.top = this.top+'px';
    }
    this.updataPosition();

    /**
     * 点击事件
     */
    this.dom.onclick = function(){
        if(game.isOver){
            return;
        }
        //相邻判断
        if(!(this.top === game.hideBlock.top && parseInt(Math.abs(this.left - game.hideBlock.left)) === parseInt(game.blockWidth) 
        ||this.left === game.hideBlock.left && parseInt(Math.abs(this.top - game.hideBlock.top)) === parseInt(game.blockHeight))){
            return;
        }
        //交换位置
        game.swap(this, game.hideBlock);
        //游戏结束判定
        game.checkIsOver();
    }.bind(this);

    game.dom.append(this.dom);
}

function Game(config){
    this.width = config.width;
    this.height = config.height;
    this.rows = config.rows;
    this.cols = config.cols;
    this.imgUrl = config.imgUrl;
    this.dom = config.dom;

    /**
     * 游戏结束事件
     */
    this.over = function(){
        this.hideBlock.dom.style.display = 'block';
        this.block.forEach(function(){
            block.dom.style.border = 'none';
        }.bind(this))   
    }

    /**
     * 游戏结束判定
     */
    this.checkIsOver = function(){
        this.isOver = this.blocks.every(function(block){
            return block.left === block.targetLeft && block.top === block.targetTop;
        })
        if(this.isOver){
            this.over();
        }
    }

    /**
     * 交换事件
     */
    this.swap = function(block1, block2){
        //交换left
        var temp = block1.left;
        block1.left = block2.left;
        block2.left = temp;
        //交换top
        var temp = block1.top;
        block1.top = block2.top;
        block2.top = temp;

        block1.updataPosition();
        block2.updataPosition();
    }

    /**
     * 判断逆序数是否为奇数
     * @returns {boolean}
     */
    this.isOddInversions = function(){
        var inversCount = 0;
        for(i = 0; i < this.blockCount - 2; i++){
            for(j = i+1; j < this.blockCount - 1; j++){
                if(this.blocks[i].top > this.blocks[j].top
                    || this.blocks[i].top === this.blocks[j].top && this.blocks[i].left > this.blocks[j].left
                ){inversCount++;}
            }
        }
        console.log(inversCount);
        return inversCount%2!==0;
    }

    /**
     * 洗牌
     */
    this.shuffle = function(){
        this.blocks.forEach(function(block, i){
            //生成随机数
            var index = Math.floor(Math.random() * (this.blocks.length - 1 - i)) + i;
            //交换位置
            this.swap(block, this.blocks[index]);
        }.bind(this));
        //判断奇偶逆序数
        if(this.isOddInversions()){
            this.swap(this.blocks[this.blockCount - 3], this.blocks[this.blockCount - 2]);
        }
    }

    /**
     * 初始化block
     */

    this.initBlock = function(){
        this.blocks = [];
        for(let r = 0; r < this.rows; r++){
            for(let c = 0; c < this.cols; c++){
                var block = new Block(this, r, c);
                this.blocks.push(block);
            }
        }
        block.dom.style.display = 'none';
        this.hideBlock = block;
        
        //打乱顺序
        this.shuffle();
    }
    
    /**
     * 初始化game容器
     */
    this.initGameDom = function() {
        this.dom.innerHTML = '';
        this.dom.style.width = this.width + 'px';
        this.dom.style.height = this.height + 'px';
        this.dom.style.border = '1px solid black';
        this.dom.style.position = 'relative';
    }

    /**
     * 初始化计算属性
     */
    this.initCompute = function(){
        this.blockWidth = this.width / this.cols;
        this.blockHeight = this.height / this.rows;
        this.blockCount = this.rows * this.cols;
    }



    /**
     * 游戏初始化
     */
    this.init = function(){
        //初始化计算属性
        this.initCompute();
        //初始化game容器
        this.initGameDom();
        //初始化block
        this.initBlock();
    }
}

game.init();