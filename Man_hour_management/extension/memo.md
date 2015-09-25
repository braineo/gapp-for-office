jQuery获取frame里的元素
```javascript
$('#findthis', window.parent.frames['frameName'].document)
```
jQuery获取frame
$('frame[name="MENU"]', top.document).contentDocument

$("frameset#MainFrame").eq(0).attr('cols','100,*')