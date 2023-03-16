const Express = require('express')
const App = Express()
const FS = require("fs")
const PackageNameRegex = require('package-name-regex')
const Fetch = require("sync-fetch")
const SemVer = require("semver")

function GetVersions(Package) {
    return Fetch(
        `https://registry.npmjs.org/${Package}`,
        {
            headers: {
                Accept: "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*"
            }
        }
    ).json().versions
}

App.get(
    "/versions/",
    async function (Request, Response) {
        console.log(Request.query.q)

        const Package = Request.query.q
        if (!PackageNameRegex.test(Package)) {
            Response.send(false)
            return
        }

        const Output = {
            Name: Package,
            Versions: Object.keys(GetVersions(Package))
        }

        Response.send(Output)
    }
)

App.get(
    "/version/",
    async function (Request, Response) {
        console.log(Request.query.q)

        const Package = Request.query.q
        const Version = Request.query.v
        if (!PackageNameRegex.test(Package)) {
            Response.send(false)
            return
        }

        const Versions = GetVersions(Package)
        const MatchingVersion = SemVer.maxSatisfying(Object.keys(Versions), Version)
        const Output = {
            Name: Package,
            Version: MatchingVersion,
            VersionData: Versions[MatchingVersion]
        }

        Response.send(Output)
    }
)


const Port = FS.readFileSync(`${process.cwd()}/PortNumber`, "utf-8")
console.log(`Listening at port number ${Port}`)
App.listen(Port)