/* MENU BUTTON */
.menu-btn{
  position:fixed;
  top:18px;
  left:18px;
  font-size:22px;
  cursor:pointer;
  z-index:1001;
}

/* SIDE MENU */
.side-menu{
  position:fixed;
  top:0;
  left:-320px;
  width:300px;
  height:100%;
  background:#ffffff;
  box-shadow:2px 0 15px rgba(0,0,0,.15);
  padding:18px;
  overflow:auto;
  transition:.3s;
  z-index:1000;
}
.side-menu.open{ left:0; }

.side-menu h2{
  font-size:18px;
  margin-bottom:14px;
}
.menu-section h3{
  font-size:14px;
  margin:12px 0 6px;
  color:#1a73e8;
}
.menu-section ul{
  list-style:none;
}
.menu-section li{
  padding:6px 0;
  cursor:pointer;
}
.menu-section li:hover{
  color:#1a73e8;
}

/* PAPERS PANEL */
.papers-panel{
  position:fixed;
  right:-100%;
  top:0;
  width:60%;
  height:100%;
  background:#fff;
  transition:.3s;
  z-index:999;
}
.papers-panel.active{ right:0; }

.papers-header{
  display:flex;
  justify-content:space-between;
  padding:12px;
  border-bottom:1px solid #ddd;
}
.papers-list{
  padding:14px;
  overflow:auto;
  height:calc(100% - 50px);
}
.paper-item{
  margin-bottom:10px;
}
.paper-item a{
  text-decoration:none;
  color:#202124;
}
.paper-item a:hover{
  text-decoration:underline;
}
