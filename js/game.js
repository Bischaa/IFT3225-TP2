'use strict';

//IFT3225-TP2
//Par Maxime Ton
//Matricule: 20143044

//Initialisation
class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gameboard: null,
            mouvements: 0,
            score: 0,
            success: false,
            stuck: false
        }
    };

    //Créer le gameboard sur lequel le jeu sera joué
    createInitialGameboard(n) {
        //Créer le board n x n rempli de zéros
        let innerboard;
        let gameboard =  [];
        for (let i=0; i < n; i++) {
            innerboard = [];
            for (let j=0; j < n; j++) {
                innerboard.push(0);
            }
            gameboard.push(innerboard);
        }
        //Placer 2 sur 2 tuiles random sur le gameboard au début du jeu
        let randomPos1 = [];
        let randomPos2 = [];
        do {
            randomPos1 = [Math.floor(Math.random() * n), Math.floor(Math.random() * n)];
            randomPos2 = [Math.floor(Math.random() * n), Math.floor(Math.random() * n)];
        } while (randomPos1[0] == randomPos2[0] && randomPos1[1] == randomPos2[2])
        gameboard[randomPos1[0]][randomPos1[1]]=this.getNewTileRandom();
        gameboard[randomPos2[0]][randomPos2[1]]=this.getNewTileRandom();

        this.setState({gameboard: gameboard, mouvements:0, success: false, stuck: false});
    };

    //Créer un gameboard vide
    createEmptyGameboard(n) {
        let innerboard;
        let gameboard =  [];
        for (let i=0; i < n; i++) {
            innerboard = [];
            for (let j=0; j < n; j++) {
                innerboard.push(0);
            }
            gameboard.push(innerboard);
        }
        return(gameboard);
    };

    //Obtenir un chiffre random entre 2 et 4
    getNewTileRandom() {
        let nums = [2,4];
        let temp = nums[Math.floor(Math.random() * 2)];
        return temp;
    }

    //Placer 2 nouveaux randoms sur des tuiles libres (PROBLÈME, génère sur les cases déjà remplies)
    placeNewTileRandom(gameboard) {
        let emptyTiles = [];

        for (let i = 0; i < gameboard.length; i++) {
            for (let j = 0; j < gameboard[i].length; j++) {
                if (gameboard[i][j] === 0) {emptyTiles.push([i, j])}
            }
        }

        let randomEmptyTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

        //console.log(gameboard.includes(emptyTiles[0]));
        //console.log(gameboard.includes(emptyTiles[1]));

        gameboard[randomEmptyTile[0]][randomEmptyTile[1]]=this.getNewTileRandom();

        this.setState({gameboard: gameboard});

        return(gameboard);
    }

    //Calculer le score
    calculateScore(gameboard) {
        let count = 0;
        for(let i=0; i < gameboard.length; i++) {
            for(let j=0; j < gameboard[i].length; j++) {
                if(gameboard[i][j] != 0) {
                    count += gameboard[i][j];
                }
            }
        }
        return count;
    };

    //Vérifier si l'on a 2048
    checkSuccess(gameboard){
        for(let i=0; i < gameboard.length; i++) {
            for(let j=0; j < gameboard[i].length; j++) {
                if(gameboard[i][j] == 2048) {
                    this.setState({success: true});
                    alert("Success!");
                }
            }
        }
        this.setState({success: false});
        //console.log("Success: "+this.state.success);
    };

    //Vérifier si l'on est coincé
    checkStuck(gameboard){
        //Si au moins une tuile est différente, alors nous pouvons encore jouer (il y a un mouvement possible)
        if(this.checkDiff(gameboard, this.moveLeft(gameboard))) {
            this.setState({stuck: false});
            //console.log("Stuck: "+this.state.stuck);
            return false;
        }
        if(this.checkDiff(gameboard, this.moveRight(gameboard))) {
            this.setState({stuck: false});
            //console.log("Stuck: "+this.state.stuck);
            return false;
        }
        if(this.checkDiff(gameboard, this.moveUp(gameboard))) {
            this.setState({stuck: false});
            //console.log("Stuck: "+this.state.stuck);
            return false;
        }
        if(this.checkDiff(gameboard, this.moveDown(gameboard))) {
            this.setState({stuck: false});
            //console.log("Stuck: "+this.state.stuck);
            return false;
        }
        //Si aucun mouvement est possible, nous sommes coincé.
        this.setState({stuck: true});
        alert("Game Over!");
        //console.log("Stuck: "+this.state.stuck);
        return true;
    };

    //Méthode pour comparer 2 boards et voir si une tuile est différente
    checkDiff(initGameboard, finalGameboard) {
        for(let i=0; i < initGameboard.length; i++) {
            for(let j=0; j < initGameboard[i].length; j++) {
                if(initGameboard[i][j] != finalGameboard[i][j]) {
                    return true;
                }
            }
        }
        return false;
    };

    //Bouger le gameboard vers la gauche
    moveLeft(gameboard) {
        let tempGameboard = this.compressLeft(gameboard);
        let finalGameboard = this.mergeLeft(tempGameboard)
        return (this.compressLeft(finalGameboard));
    };

    //Compresser le gameboard après un mouvement vers la gauche
    compressLeft(gameboard) {
        const tempGameboard = this.createEmptyGameboard(4);
        for(let i = 0; i < gameboard.length; i++) {
            //Reset l'index en x à chaque descente en y
            let x = 0;
            for(let j = 0; j < gameboard[i].length; j++) {
                //Si on trouve une tuile non-nulle sur notre gameboard, la bouger vers la gauche
                if(gameboard[i][j] != 0) {
                    tempGameboard[i][x] = gameboard[i][j];
                    //Le prochain chiffre trouver sur cette ligne sera une tuile à droite
                    if(x < gameboard.length) {
                        x++;
                    }
                }
            }
        }
        return tempGameboard;
    };

    //Merge les cellules vers la gauche
    mergeLeft(gameboard) {
        for(let i=0; i < gameboard.length; i++) {
            for(let j = 0; j < gameboard[i].length; j++) {
                //Si deux tuiles adjacentes se touchent, les merge ensemble et doubler la valeur de la tuile résultante
                if(gameboard[i][j] != 0 && gameboard[i][j] == gameboard[i][j+1]) {
                    gameboard[i][j] = (gameboard[i][j])*2;
                    //console.log(i,j+1);
                    gameboard[i][j+1] = 0;
                }
            }
        }
        //Le tableau sera décompresser après le merge
        return gameboard;
    };

    //Bouger le gameboard vers la droite
    moveRight(gameboard) {
        let tempGameboard = this.compressRight(gameboard);
        let finalGameboard = this.mergeRight(tempGameboard)
        return (this.compressRight(finalGameboard));
    };

    //Compresser le gameboard après un mouvement vers la droite
    compressRight(gameboard) {
        const tempGameboard = this.createEmptyGameboard(4);
        for(let i = 0; i < gameboard.length; i++) {
            //Reset l'index en x à chaque descente en y
            let x = gameboard.length-1;
            for(let j = gameboard[i].length-1; j >= 0; j--) {
                //Si on trouve une tuile non-nulle sur notre gameboard, la bouger vers la droite
                if(gameboard[i][j] != 0) {
                    tempGameboard[i][x] = gameboard[i][j];
                    //Le prochain chiffre trouver sur cette ligne sera une tuile à gauche
                    if(x > 0) {
                        x--;
                    }
                }
            }
        }
        return tempGameboard;
    };

    //Merge les cellules vers la gauche
    mergeRight(gameboard) {
        for(let i=0; i < gameboard.length; i++) {
            for(let j = gameboard[i].length-1; j >= 0; j--) {
                //Si deux tuiles adjacentes se touchent, les merge ensemble et doubler la valeur de la tuile résultante
                if(gameboard[i][j] != 0 && gameboard[i][j] == gameboard[i][j-1]) {
                    gameboard[i][j] = (gameboard[i][j])*2;
                    //console.log(i,j-1);
                    gameboard[i][j-1] = 0;
                }
            }
        }
        //Le tableau sera décompresser après le merge
        return gameboard;
    };

    //Bouger le gameboard vers le haut
    moveUp(gameboard) {
        let tempGameboard = this.compressUp(gameboard);
        let finalGameboard = this.mergeUp(tempGameboard)
        return (this.compressUp(finalGameboard));
    };

    //Compresser le gameboard après un mouvement vers le haut
    compressUp(gameboard) {
        const tempGameboard = this.createEmptyGameboard(4);
        for(let i = 0; i < gameboard.length; i++) {
            //Reset l'index en y à chaque déplacement en x
            let y = 0;
            for(let j = 0; j < gameboard[i].length; j++) {
                //Si on trouve une tuile non-nulle sur notre gameboard, la bouger vers le haut
                if(gameboard[j][i] != 0) {
                    tempGameboard[y][i] = gameboard[j][i];
                    //Le prochain chiffre trouver sur cette ligne sera une tuile en bas
                    if(y < gameboard.length) {
                        y++;
                    }
                }
            }
        }
        return tempGameboard;
    };

    //Merge les cellules vers le haut
    mergeUp(gameboard) {
        for(let i=0; i < gameboard.length; i++) {
            for(let j = 0; j < gameboard[i].length; j++) {
                //Si deux tuiles adjacentes se touchent, les merge ensemble et doubler la valeur de la tuile résultante
                if(j != gameboard.length-1) {
                    if (gameboard[j][i] != 0 && gameboard[j][i] == gameboard[j + 1][i]) {
                        gameboard[j][i] = (gameboard[j][i]) * 2;
                        gameboard[j + 1][i] = 0;
                    }
                }
            }
        }
        return gameboard;
    };

    //Bouger le gameboard vers le bas
    moveDown(gameboard) {
        let tempGameboard = this.compressDown(gameboard);
        let finalGameboard = this.mergeDown(tempGameboard)
        return (this.compressDown(finalGameboard));
    };

    //Compresser le gameboard après un mouvement vers le bas
    compressDown(gameboard) {
        const tempGameboard = this.createEmptyGameboard(4);
        for(let i = 0; i < gameboard.length; i++) {
            //Reset l'index en y à chaque déplacement en x
            //console.log(gameboard.length);
            let y = gameboard.length-1;
            for(let j = gameboard[i].length-1; j >= 0; j--) {
                //Si on trouve une tuile non-nulle sur notre gameboard, la bouger vers le bas
                if(gameboard[j][i] != 0) {
                    tempGameboard[y][i] = gameboard[j][i];
                    //Le prochain chiffre trouver sur cette ligne sera une tuile en haut
                    if(y > 0) {
                        y--;
                    }
                }
            }
        }
        return tempGameboard;
    };

    //Merge les cellules vers la gauche
    mergeDown(gameboard) {
        for(let i=0; i < gameboard.length; i++) {
            for(let j = gameboard[i].length-1; j >= 0; j--) {
                //Si deux tuiles adjacentes se touchent, les merge ensemble et doubler la valeur de la tuile résultante
                if(j != 0) {
                    if (gameboard[j][i] != 0 && gameboard[j][i] == gameboard[j - 1][i]) {
                        gameboard[j][i] = (gameboard[j][i]) * 2;
                        gameboard[j - 1][i] = 0;
                    }
                }
            }
        }
        return gameboard;
    };

    //Update le gameboard avec un mouvement à gauche
    inputLeft() {
        let tempGameboard = this.moveLeft(this.state.gameboard);
        //console.log("pre timeout");
        this.setState({gameboard: tempGameboard, score: this.calculateScore(tempGameboard), movements: this.state.mouvements++, success: this.checkSuccess(tempGameboard), stuck: this.checkStuck(tempGameboard)});
        tempGameboard = this.placeNewTileRandom(this.state.gameboard);
        this.setState({gameboard: tempGameboard, score: this.calculateScore(tempGameboard), movements: this.state.mouvements, success: this.checkSuccess(tempGameboard), stuck: this.checkStuck(tempGameboard)});
        //console.log("passed timeout");
    };
    //Update le gameboard avec un mouvement à droite
    inputRight() {
        let tempGameboard = this.moveRight(this.state.gameboard);
        this.setState({gameboard: tempGameboard, score: this.calculateScore(tempGameboard), movements: this.state.mouvements++, success: this.checkSuccess(tempGameboard), stuck: this.checkStuck(tempGameboard)});
        //console.log("pre timeout");
        tempGameboard = this.placeNewTileRandom(this.state.gameboard);
        this.setState({gameboard: tempGameboard, score: this.calculateScore(tempGameboard), movements: this.state.mouvements, success: this.checkSuccess(tempGameboard), stuck: this.checkStuck(tempGameboard)});
        //console.log("passed timeout");
    };
    //Update le gameboard avec un mouvement vers le haut
    inputUp() {
        let tempGameboard = this.moveUp(this.state.gameboard);
        this.setState({gameboard: tempGameboard, score: this.calculateScore(tempGameboard), movements: this.state.mouvements++, success: this.checkSuccess(tempGameboard), stuck: this.checkStuck(tempGameboard)});
        //console.log("pre timeout");
        tempGameboard = this.placeNewTileRandom(this.state.gameboard);
        this.setState({gameboard: tempGameboard, score: this.calculateScore(tempGameboard), movements: this.state.mouvements, success: this.checkSuccess(tempGameboard), stuck: this.checkStuck(tempGameboard)});
        //console.log("passed timeout");
    };
    //Update le gameboard avec un mouvement le bas
    inputDown() {
        let tempGameboard = this.moveDown(this.state.gameboard);
        this.setState({gameboard: tempGameboard, score: this.calculateScore(tempGameboard), movements: this.state.mouvements++, success: this.checkSuccess(tempGameboard), stuck: this.checkStuck(tempGameboard)});
        //console.log("pre timeout");
        tempGameboard = this.placeNewTileRandom(this.state.gameboard);
        this.setState({gameboard: tempGameboard, score: this.calculateScore(tempGameboard), movements: this.state.mouvements, success: this.checkSuccess(tempGameboard), stuck: this.checkStuck(tempGameboard)});
        //console.log("passed timeout");
    };
    //Commence une nouvelle partie
    inputNew() {
        this.createInitialGameboard(4);
        colorCells();
    }
    //Print le array (troubleshooting)
    inputQ() {
        console.log(this.state.gameboard);
    };

    //Bouger le board avec les flèches du clavier
    handleKeyDown(e) {
        switch (e.keyCode) {
            case 37:
                this.inputLeft();
                //console.log("Left");
                break;
            case 38:
                this.inputUp();
                //console.log("Up");
                break;
            case 39:
                this.inputRight();
                //console.log("Right");
                break;
            case 40:
                this.inputDown();
                //console.log("Down");
                break;
            case 78:
                this.inputNew();
                break;
            case 81:
                this.inputQ();
                break;
        }
    };

    //L'initialisation ne marche pas dans le constructeur, solution temporaire (méthode dépréciée) (À REVOIR)
    componentWillMount() {
        this.createInitialGameboard(4);
        colorCells();
        //document.addEventListener('keydown', this.handleKeyDown.bind(this));
    };

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        colorCells();
    };

    render(){

        /* Ne marche pas, logique pour une table n x n
        function convertTable(gameboard) {
            if(!document.getElementById('tempBody')) {
                let table = document.createElement('table');
                table.setAttribute("id", "tempTable");
                let tableBody = document.createElement('tablebody');
                table.setAttribute("id", "tempBody");

                gameboard.forEach(function (rowData) {
                    let row = document.createElement('tr');

                    rowData.forEach(function (cellData) {
                        let cell = document.createElement('td');
                        cell.appendChild(document.createTextNode(cellData));
                        row.appendChild(cell);
                    });
                    tableBody.appendChild(row);
                });
                table.appendChild(tableBody);
                document.body.appendChild(table);
            } else {
                document.getElementById('tempTable').removeChild(document.getElementById('tempBody'));
                let table = document.createElement('table');
                table.setAttribute("id", "tempTable");
                let tableBody = document.createElement('tablebody');
                table.setAttribute("id", "tempBody");

                gameboard.forEach(function (rowData) {
                    let row = document.createElement('tr');

                    rowData.forEach(function (cellData) {
                        let cell = document.createElement('td');
                        cell.appendChild(document.createTextNode(cellData));
                        row.appendChild(cell);
                    });
                    tableBody.appendChild(row);
                });
                table.appendChild(tableBody);
                document.body.appendChild(table);
            }
        }
         */
        //Solution temporaire pour une table 4x4 (À REVOIR)

        return(
            <div>
                <div className="score">Score: {this.state.score}</div>
                <div className="movements">Moves: {this.state.mouvements}</div>

                <table id="gametable">
                    <tbody>
                        {this.state.gameboard.map((value, i) => {
                          return(
                            <tr key={i}>
                                <td>{value[0]}</td>
                                <td>{value[1]}</td>
                                <td>{value[2]}</td>
                                <td>{value[3]}</td>
                            </tr>
                          );
                        })
                        }
                        {colorCells()}
                    </tbody>
                </table>
            </div>
        );
    };
};

//Fonction qui modifie le CSS pour colorer les différentes valeurs
function colorCells() {
    if(document.getElementById("gametable")) {
        const table = document.getElementById("gametable");
        const tbody = table.getElementsByTagName('tbody')[0];
        let cells = tbody.getElementsByTagName('td');

        for (let i = 0; i < cells.length; i++) {
            switch (parseInt(cells[i].innerHTML)) {
                case 0:
                    cells[i].style.backgroundColor = "lightgrey";
                    cells[i].style.color = "lightgrey";
                    break;
                case 2:
                    cells[i].style.backgroundColor = "yellow";
                    cells[i].style.color = "black";
                    break;
                case 4:
                    cells[i].style.backgroundColor = "gold";
                    cells[i].style.color = "black";
                    break;
                case 8:
                    cells[i].style.backgroundColor = "orange";
                    cells[i].style.color = "black";
                    break;
                case 16:
                    cells[i].style.backgroundColor = "darkorange";
                    cells[i].style.color = "black";
                    break;
                case 32:
                    cells[i].style.backgroundColor = "coral";
                    cells[i].style.color = "black";
                    break;
                case 64:
                    cells[i].style.backgroundColor = "tomato";
                    cells[i].style.color = "black";
                    break;
                case 128:
                    cells[i].style.backgroundColor = "orangered";
                    cells[i].style.color = "black";
                    break;
                case 256:
                    cells[i].style.backgroundColor = "red";
                    cells[i].style.color = "black";
                    break;
                case 512:
                    cells[i].style.backgroundColor = "firebrick";
                    cells[i].style.color = "black";
                    break;
                case 1024:
                    cells[i].style.backgroundColor = "darkred";
                    cells[i].style.color = "black";
                    break;
                case 2048:
                    cells[i].style.backgroundColor = "purple";
                    cells[i].style.color = "black";
                    break;
                case 4096:
                    cells[i].style.backgroundColor = "deepskyblue";
                    cells[i].style.color = "black";
                    break;
                case 8192:
                    cells[i].style.backgroundColor = "royalblue";
                    cells[i].style.color = "black";
                    break;
                case 18384:
                    cells[i].style.backgroundColor = "blue";
                    cells[i].style.color = "black";
                    break;
            }
        }
    }
};

ReactDOM.render(<Game />, document.getElementById('main-div'))
