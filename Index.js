const Express = require('express')
const App = Express()
const FS = require("fs")
const Execute = require("child_process").execSync
const PackageNameRegex = require('package-name-regex')

App.get(
    "/versions/:package",
    async function (Request, Response) {
        console.log(Request.params.package)

        const Package = Request.params.package
        if (!PackageNameRegex.test(Package)) {
            Response.send(false)
            return
        }

        var Output
        try {
            Output = Execute(`npm view ${Package} versions name --json`)
        } catch (error) {
            return Response.send(false)
        }
        const OutputData = JSON.parse(Output.toString())

        if (typeof OutputData != "object") {
            Response.send(false)
            return
        }

        Response.send(OutputData)
    }
)

const Port = FS.readFileSync(`${process.cwd()}/PortNumber`, "utf-8")
console.log(`Listening at port number ${Port}`)
App.listen(Port)