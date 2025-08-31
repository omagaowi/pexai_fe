import React from "react"
import { Link } from "react-router-dom"

const CollectionCard = ({ collection }) => {
    return (
        <Link to={ `/collections/${ collection.collection_id }` } className="w-full overflow-hidden cursor-pointer h-[270px] rounded-lg relative bg-amber-50">
            <img
              src={` ${ collection.thumbnail? collection.thumbnail.thumbnail : '/assets/images/thumb13.jpg' } `}
              className="w-full rounded-lg h-full hover:scale-[1.3] transition-all duration-400 object-cover"
              alt=""
            />
            <div className="absolute rounded-lg pointer-events-none top-0 left-0 bottom-0 right-0 collection-gradient">
              <div className="absolute bottom-[20px] left-[20px]">
                <h1 className="text-[#fff] text-[20px]">{ collection.name }</h1>
              </div>
            </div>
          </Link>
    )
}

export default CollectionCard