(function($){
/* scan individual table and set "cellPos" data in the form { left: x-coord, top: y-coord } */
function scanTable( $table ) {
    var m = [];
    $table.children( "tr" ).each( function( y, row ) {
        $( row ).children( "td, th" ).each( function( x, cell ) {
            var $cell = $( cell ),
                cspan = $cell.attr( "colspan" ) | 0,
                rspan = $cell.attr( "rowspan" ) | 0,
                tx, ty;
            cspan = cspan ? cspan : 1;
            rspan = rspan ? rspan : 1;
            for( ; m[y] && m[y][x]; ++x );  //skip already occupied cells in current row
            for( tx = x; tx < x + cspan; ++tx ) {  //mark matrix elements occupied by current cell with true
                for( ty = y; ty < y + rspan; ++ty ) {
                    if( !m[ty] ) {  //fill missing rows
                        m[ty] = [];
                    }
                    m[ty][tx] = true;
                }
            }
            var pos = { top: y, left: x };
            $cell.data( "cellPos", pos );
        } );
    } );
};

/* plugin */
$.fn.cellPos = function( rescan ) {
    var $cell = this.first(),
        pos = $cell.data( "cellPos" );
    if( !pos || rescan ) {
        var $table = $cell.closest( "table, thead, tbody, tfoot" );
        scanTable( $table );
    }
    pos = $cell.data( "cellPos" );
    return pos;
}
})(jQuery);