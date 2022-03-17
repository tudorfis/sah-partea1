
const imgUrl = './img/'
const imgExt = '.png'

const initialPlacement = {
    'e4': ['w','r'],
    'b4': ['b','r'],
    
    'c1': ['w','b'],
    'd1': ['w','q'],
    'e1': ['w','kk'],
    'f1': ['w','b'],
    'g1': ['w','k'],
    'h1': ['w','r'],

    'a2': ['w','p'],
    'b2': ['w','p'],
    'c2': ['w','p'],
    'd2': ['w','p'],
    'e2': ['w','p'],
    'f2': ['w','p'],
    'g2': ['w','p'],
    'h2': ['w','p'],
    
    'a8': ['b','r'],
    'b8': ['b','k'],
    'c8': ['b','b'],
    'd8': ['b','q'],
    'e8': ['b','kk'],
    'f8': ['b','b'],
    'g8': ['b','k'],
    'h8': ['b','r'],

    'a7': ['b','p'],
    'b7': ['b','p'],
    'c7': ['b','p'],
    'd7': ['b','p'],
    'e7': ['b','p'],
    'f7': ['b','p'],
    'g7': ['b','p'],
    'h7': ['b','p'],
}

function $( selector ) {
    return document.querySelector( selector )
}

function deepclone( obj ) {
    return JSON.parse( JSON.stringify( obj ) )
}

function getCols() {
    return [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ]
}

function getRows() {
    return [ '1', '2', '3', '4', '5', '6', '7', '8' ]
}

function getCell( col, row ) {
    return $(`[col="${col}"][row="${row}"]`)
}
function getCells() {
    return [ ...document.querySelectorAll( '.cell' ) ]
}

function generateChessModel() {
    const chessModel = {}

    for ( const col of getCols() ) {
        chessModel[ col ] = {}
    
        for ( const row of getRows() ) {
            chessModel[ col ][ row ] = {
                piece: [],
                potentials: []
            }
        }
    }

    return chessModel
}

function iterateChessModel( callbackFn ) {
    for ( const col in chessModel ) {
        for ( const row in chessModel[ col ] ) {
            const [ color, piece ] = chessModel[ col ][ row ].piece
            callbackFn( col, row, color, piece )
        }
    } 
}

function renderChessHtml() {
    const chessBoardHtml = $('#chessBoard')

    let isWhite1 = true
    let isWhite2 = false

    const htmlRow1 = []
    const htmlRow2 = []

    for ( let i = 0; i < 8; i++ ) {
        const cell1 = document.createElement( 'div' )
        cell1.classList.add( 'cell' )
        cell1.classList.add( isWhite1 ? 'white' : 'black' )
        htmlRow1.push( cell1 )

        const cell2 = document.createElement( 'div' )
        cell2.classList.add( 'cell' )
        cell2.classList.add( isWhite2 ? 'white' : 'black' )
        htmlRow2.push( cell2 )

        cell1.setAttribute( 'col', getCols()[ i ] )
        cell2.setAttribute( 'col', getCols()[ i ] )

        isWhite1 = !isWhite1
        isWhite2 = !isWhite2
    }


    for ( let i = 4; i >= 1; i-- ) {
        htmlRow1.forEach( cell => {
            const cloneCell = cell.cloneNode(true)
            cloneCell.setAttribute( 'row', i * 2 )

            const positionText = document.createElement( 'span' )
            positionText.classList.add( 'position-text' )
            positionText.innerText = cloneCell.getAttribute( 'col' ) + cloneCell.getAttribute( 'row' )

            cloneCell.append( positionText )
            chessBoardHtml.append( cloneCell )
        })
        htmlRow2.forEach( cell => {
            const cloneCell = cell.cloneNode(true)
            cloneCell.setAttribute( 'row', (i * 2) - 1 )

            const positionText = document.createElement( 'span' )
            positionText.classList.add( 'position-text' )
            positionText.innerText = cloneCell.getAttribute( 'col' ) + cloneCell.getAttribute( 'row' )

            cloneCell.append( positionText )
            chessBoardHtml.append( cloneCell )
        })
    }
}

function arangePiecesPositions() {
    for ( const position in initialPlacement ) {
        const [ col, row ] = position.split( '' )

        chessModel[ col ][ row ].piece = [ ...initialPlacement[ position ] ]
    }
}

function renderChessPieces() {
    iterateChessModel(( col, row, color, piece ) => {
        if ( color && piece ) {
            const img = document.createElement( 'img' )
            const imgSrc = `${ imgUrl }${ color }_${ piece }${ imgExt }`

            img.setAttribute( 'src', imgSrc )
            getCell( col, row ).append( img )
        }
    })
}

/////

function generateMovement( col, row ) {
    const [ color, piece ] = chessModel[ col ][ row ].piece

    const specificConfig = {
        'r': generateRook
    }

    specificConfig[ piece ]( col, row, color )
}

function generateRook( col, row, color ) {
    const colNr = getCols().indexOf( col )
    const rowNr = parseInt( row )

    for ( let _col = colNr + 1; _col < 8; _col++ )
        if ( !checkPotential( color, col, row, getCols()[ _col ], row ) ) break

    for ( let _col = colNr - 1; _col >= 0; _col-- )
        if ( !checkPotential( color, col, row, getCols()[ _col ], row ) ) break

    for ( let _row = rowNr + 1; _row <= 8; _row++ )
        if ( !checkPotential( color, col, row, col, _row ) ) break

    for ( let _row = rowNr - 1; _row >= 0; _row-- )
        if ( !checkPotential( color, col, row, col, _row ) ) break
}

function checkPotential( color, col, row, _col, _row ) {
    const [ _color, _piece ] = chessModel[ _col ][ _row ].piece

    if ( !_color || color !== _color  ) {
        chessModel[ col ][ row ].potentials.push( _col + _row )
    }

    return !_color
}
//////

function addEventListeners() {
    getCells().forEach( cell => {
        cell.addEventListener( 'click', function(){
            const col = cell.getAttribute( 'col' )
            const row = cell.getAttribute( 'row' )

            /// move piece
            if ( !!pieceSelected.length && cell.classList.contains('highlight')) {
                console.log( '1')
                
                const [ _col, _row ] = pieceSelected
                const _cell = getCell(_col, _row)
                const _img = _cell.querySelector( 'img' )
                
                cell.querySelector( 'img' )?.remove()
                cell.append( _img )

                chessModel[ col ][ row ] = {
                    piece: [ ...chessModel[ _col ][ _row ].piece ],
                    potentials: []
                }

                chessModel[ _col ][ _row ] = {
                    piece: [],
                    potentials: []
                }

                dehilightCells()
                pieceSelected = []
                isWhiteTurn = !isWhiteTurn
            }

            /// generate movement
            else if ( canMove( col, row ) ) {
                pieceSelected = [ col, row ]
                generateMovement( col, row )
                highlightPotentials( col, row )
            }
        })
    })
}



function canMove( col, row ) {
    const hasPiece = !!chessModel[ col ][ row ].piece.length
    const [ color ] = chessModel[ col ][ row ].piece

    return hasPiece && (isWhiteTurn && color === 'w' || !isWhiteTurn && color === 'b' )
}

function dehilightCells() {
    getCells().forEach( cell => cell.classList.remove( 'highlight' ) )
}

function highlightPotentials( col, row ) {
    dehilightCells()

    const { potentials } = chessModel[ col ][ row ]
    
    potentials.forEach( position => {
        const [ col, row ] = position.split( '' )
        const cell = getCell( col, row )
        cell.classList.add( 'highlight')
    })
}


/////

renderChessHtml()
let pieceSelected = []
let isWhiteTurn = true
const chessModel = generateChessModel()

arangePiecesPositions()
renderChessPieces()
addEventListeners()

// generateMovement( 'e', '4' )
// console.log( chessModel['e']['4'] )

window.chessModel = chessModel
window.generateMovement = generateMovement