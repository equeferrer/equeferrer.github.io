(function (){
  console.log('%c Monster Slayer', 'font-weight: bold; font-size: 40px;color: #92a5de; text-shadow:0px 0px 0 rgb(137,156,213),1px 1px 0 rgb(129,148,205),2px 2px 0 rgb(120,139,196),3px 3px 0 rgb(111,130,187),4px 4px 0 rgb(103,122,179),5px 5px 0 rgb(94,113,170),6px 6px 0 rgb(85,104,161),7px 7px 0 rgb(76,95,152),8px 8px 0 rgb(68,87,144),9px 9px 0 rgb(59,78,135),10px 10px 0 rgb(50,69,126),11px 11px 0 rgb(42,61,118),12px 12px 0 rgb(33,52,109),13px 13px 0 rgb(24,43,100),14px 14px 0 rgb(15,34,91),15px 15px 0 rgb(7,26,83),16px 16px 0 rgb(-2,17,74),17px 17px 0 rgb(-11,8,65),18px 18px 0 rgb(-19,0,57),19px 19px 0 rgb(-28,-9,48), 20px 20px 0 rgb(-37,-18,39),21px 21px 20px rgba(0,0,0,1),21px 21px 1px rgba(0,0,0,0.5),0px 0px 20px rgba(0,0,0,.2);');
  console.log('%cOne day, Dora the Explorer decided to \nswitch careers to become a Monster Slayer...', 'background: #222; color: #bada55; font-weight: 800; font-size: 18px');

  // ****************************** Matrix ******************************
  let Matrix = function(x,y){
    this.x = x;
    this.y = y;
  }

  function getMatrix(){
    let inputDimensions = null
    while (inputDimensions === null ) {
      let value = prompt("Enter dimensions (width,height) of the dungeon e.g. (10 10)");
        if (matrixValid(value) ){
          inputDimensions = value    
        } else {
          alert("Invalid dimensions, Must follow this format: `10 10`")
        }
    }
    let width = inputDimensions.split(' ')[0]
    let height = inputDimensions.split(' ')[1]
    newMatrix = new Matrix(width, height);
    console.log(`Dungeon dimensions: (${inputDimensions}) [width, height]`);
  }
  getMatrix();

  // // ****************************** Monster ******************************
  let Monster = function(x,y,power){
    this.x = x;
    this.y = y;
    this.power = power
  }

  let blank = "";
  let monsterArray = [];
  do{
    var inputMonster = prompt("Create new monster by entering (x, y, power_level) e.g. (10 10 10). Click OK/Enter to start the game");
      if (inputMonster === "") {
        console.log('%c List of Monsters: ', 'background: #222; color: #8b0000; font-weight: 800; font-size: 20px')
        console.table(monsterArray);
        inputMonster = blank
      } else if (monsterValid(inputMonster) && !validCoordinates(inputMonster, newMatrix)) {
        console.log("Out of bounds/illegal coordinates")
      } else if (monsterValid(inputMonster) && validCoordinates(inputMonster, newMatrix)) {
        let x = inputMonster.split(' ')[0];
        let y = inputMonster.split(' ')[1];
        let power_level = inputMonster.split(' ')[2];
        monsterArray.forEach((obj, index) => {
          if (y === obj.y && x === obj.x){
            monsterArray.splice(index, 1);
            console.log("%cReplaced monster at given coordinates", "font-style: italic;")
          }
        });
        newMonster = new Monster(x,y,power_level);
        monsterArray.push(newMonster);
        console.log(`%cNew monster created: (${inputMonster}) [x, y, power_level]`, 'font-weight: 800; color: red; font-size: 14px;');
      } else {
        alert( "Invalid dimensions. Must follow this format: `10 10 10`" );
      }
  } while(inputMonster !== blank);
  
  // ****************************** Dora's path ****************************** 
  let path = null

  function getPath(){
    while (path === null ) {
      let inputPath = prompt("Enter path: u(up), d(down), r(right), l(left)");
        if (pathValid(inputPath) ){
          path = inputPath    
        } else {
          alert("Invalid path. Must follow this format: `urldurld`")
        }
    }
    console.log(`Path: (${path.split('')})`);
  }
  getPath();

  // ****************************** Start Game ****************************** 
  let Dora = function(x,y,power){
    this.x = x;
    this.y = y;
    this.power = power;
    this.alive = true;
  }

  let dora = new Dora(0,0,10);
  let killCounter = 0;

  function startGame(player, monsters, steps){
    let stepsArr = steps.split('');
    stepsArr.forEach((step) => {
      if (player.alive === true ){
        if (step === "u" && player.y < newMatrix.y) {
          player.y += 1
        } else if (step === "d" && player.y > 0) {
          player.y -= 1
        } else if (step === "l" && player.x > 0) {
          player.x -= 1
        } else if (step === "r" && player.x < newMatrix.x) {
          player.x += 1
        } else {
          return
        }

        monsters.forEach((obj, index) => {
          if (parseInt(obj.y) === player.y && parseInt(obj.x) === player.x){
            if (player.power >= obj.power) {
              monsterArray.splice(index, 1);
              killCounter += 1
            } else {
              player.alive = false
            }
          }
        });
      }
    })
    if (player.alive === true) {
      console.log("Dora is alive!")
    } else {
      console.log("Dora is dead!")
    }
    console.log(`Coordinates of the last room visited: ${player.x}, ${player.y}`)
    console.log(`Number of kills: ${killCounter}`);
  }
  startGame(dora, monsterArray, path);

  // ****************************** Input Validation ****************************** 
  function matrixValid(x){
    let combined = x.replace(/\s/,'')
    if (Number.isInteger(Number(combined))
          && x.split(' ').length === 2
          && Number.isInteger(Number(x.split(' ')[0]))
          && Number.isInteger(Number(x.split(' ')[1]))    
          && Number(x.split(' ')[0]) > 0
          && Number(x.split(' ')[1]) > 0)
    {
      return true
    } else  {
      return false
    }    
  }

  function monsterValid(x){
    let combined = x.replace(/\s/,'').replace(/\s/,'')
    if (Number.isInteger(Number(combined))
          && x.split(' ').length === 3
          && Number.isInteger(Number(x.split(' ')[0]))
          && Number.isInteger(Number(x.split(' ')[1]))    
          && Number.isInteger(Number(x.split(' ')[2]))    
          && Number(x.split(' ')[0]) >= 0
          && Number(x.split(' ')[1]) >= 0
          && Number(x.split(' ')[2]) >= 0)
    {
      return true
    } else  {
      return false
    }    
  }

  function validCoordinates(monster, dungeon){
    let monsterX = Number(monster.split(' ')[0]);
    let monsterY = Number(monster.split(' ')[1]);
    let dungeonX = dungeon.x
    let dungeonY = dungeon.y
    if (monsterX <= dungeonX && monsterY <= dungeonY && ( monsterX + monsterY !== 0 )) {
      return true
    } else {
      return false
    }
  }

  function pathValid(x){
    let validLetters = /^[UDLRudlr]+$/;
    if (x.match(validLetters)) {
      return true
    } else {
      return false
    }    
  }
})();