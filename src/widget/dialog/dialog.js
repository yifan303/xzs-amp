var html = `
  <div class="modal fade">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">坑位提示</div>
        <div class="modal-body modal-info">坑位信息不全，不能添加</div>
      </div>
    </div>
  </div>
`
var dialog = $(html)

$('#content').append(dialog)

module.exports = (content = '',header = '提示') => {
  dialog.find('.modal-info').html(content)
  dialog.find('.modal-header').html(header)
  dialog.modal('show')
}
