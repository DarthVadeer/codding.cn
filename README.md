# codding

```
{
  const video = vm.cctv.video
  let arr = []

  video.group.concat(video.group2).forEach((v) => {
    arr = arr.concat(v.list)
  })

  console.log(JSON.stringify(arr.map(v=>{return {desc: v.desc, id: v.id}})))
}
```