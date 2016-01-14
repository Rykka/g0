var $ = require('jquery')

class Console {
    log(msg) {
        $('#main').append('<p>'+msg+'</p>')
    }
}
var console = new Console()

class Random {
    R2() {
        // 0~1
        return  Math.floor(Math.random() * 2)
    }
    R3() {
        // 0~2
        return  Math.floor(Math.random() * 3)
    }
    R4() {
        // 0~2
        return  Math.floor(Math.random() * 4)
    }
    R5() {
        // 0~7
        return  Math.floor(Math.random() * 5)
    }
    R6() {
        return  Math.floor(Math.random() * 6)
    }
    R8() {
        return  Math.floor(Math.random() * 8)
    }
    R12() {
        return  Math.floor(Math.random() * 12)
    }
    R28() {
        return  Math.floor(Math.random() * 28)
    }
}
var RND = new Random()
    
// Race
// Prof

// Buff:
// time
// effect

// Dmg:
// Cric
// Miss
// Armor

// Stragedy:
// Aggressive
// Defensive

class Player {
    constructor(name){
        this.name = name || 'player'
        this.hp = 30
        this.mp = 1
        this.has_heal = 3
    }
    attack(target){
        let atk = RND.R4() + 2
        // console.log(this.name + ' does ' + atk +' DMG to ' + target.name )
        target.hp-=atk
    }
    skill(target){
        if (RND.R28() == 0) {
            console.log(this.name + ' restore ' + 10  + ' mp')
            this.mp+=10
        }
        
        if (this.has_heal && ((RND.R4() && this.hp <= 20) || (RND.R2() && this.hp <= 10 ) || (this.hp <= 5 && target.hp>=6) )) {
            if ( this.mp >= 6) {
                this.has_heal-- 
                let heal = RND.R8() + 8
                this.hp += heal
                console.log(this.name + ' use ' + 5  + ' mp , does ' + heal +' heal to' + this.hp)
                if (this.hp > 30) {
                    this.hp = 30
                }
                this.mp -= 6
            }
        } else {
            if ( this.mp >= 12) {
                let atk = RND.R12() + 15 
                console.log(this.name + ' use ' + 10  + ' mp , does ' + atk +' AA DMG to ' + target.name )
                target.hp -= atk
                this.mp -= 10
            } else if ( this.mp >= 8 ) {
                let atk = RND.R12() + 5
                // console.log(this.name + ' use ' + 5  + ' mp , does ' + atk +' LIGHTING DMG to ' + target.name )
                target.hp -= atk
                this.mp -= 8
            } else if (this.mp >= 5 ){
                let atk = RND.R5() + 4
                // console.log(this.name + ' use ' + 5  + ' mp , does ' + atk +' LIGHTING DMG to ' + target.name )
                target.hp -= atk
                this.mp -= 5
            }
        }

    }
    action(game, cb) {
        if (this.mp >= 5 ) {
            if (RND.R3() > 0) {
                this.skill(game.enemy(this))
            } else {
                this.attack(game.enemy(this))
            }
        } else {
            this.attack(game.enemy(this))
        }

        setTimeout(() =>{
            game.endTurn(this)
        }, 0);
    }
}

var p1_won = 0
var p2_won = 0

class Game {
    constructor(p1, p2, i){
        this.id = i
        this.p1 = p1
        this.p2 = p2
        this.players= [p1, p2]
        this.round_num = 1
        this.p2.mp=3
    }
    enemy(p){
        if (p==this.p1) {
            return this.p2
        } else {
            return this.p1
        }
    }
    endTurn(p){
        this.nextRound()
    }
    nextRound(){
        this.round_num++
        this.round()
    }
    round(){
        let p1 = this.p1
        let p2 = this.p2
        if (p1.hp<=0 || p2.hp<=0) {
            this.end()
        } else {
        // console.log("===== " + this.id + " ROUND ' + this.round_num + ' =====")
        p1.mp++
        p2.mp++
        // console.log(p1.name + ' HP ' + p1.hp + ' MP ' + p1.mp + ' : ' + p2.name + ' HP ' + p2.hp +' MP ' + p2.mp)
            if (this.round_num % 2 ) {
                p1.action(this)
            } else {
                p2.action(this)
            }
        }
    }
    round_fin(){
        this.round()
    }
    start(){
        this.round()
    }
    end(){
        let p1 = this.p1
        let p2 = this.p2
        console.log("===== ID " + this.id + " GAME END " + this.round_num + " TURN =====")
            if (p1.hp > p2.hp) {
                // console.log(p1.name + ' WON')
                p1_won++
            } else {
                // console.log(p2.name + ' WON')
                p2_won++
            }
    }
}


for (var i=0; i< 100 ; i++) {
    let p1 = new Player('Timmy'+i)
    let p2 = new Player('John'+i)
    let g1 = new Game(p1, p2, i)
    g1.start()
}

setTimeout(function() { 
    console.log('P1 WON:' + p1_won)
    console.log('P2 WON:' + p2_won)
}, 500);

