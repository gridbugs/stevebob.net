while(<>){
    s/<a href=([^>]*)>([^<]*)<\/a>/[$2]($1)/;
    print 
}
